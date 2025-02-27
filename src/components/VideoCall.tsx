import React, { useEffect, useRef, useState } from 'react';
import { X, Mic, MicOff, Video as VideoIcon, VideoOff, PhoneOff, UserPlus } from 'lucide-react';
import SimplePeer from 'simple-peer';
import useStore from '../store/useStore';
import socket from '../services/socket';

interface VideoCallProps {
  onClose: () => void;
}

const VideoCall: React.FC<VideoCallProps> = ({ onClose }) => {
  const {
    currentUser,
    otherUsers,
    videoCall,
    endVideoCall,
    addPeer,
    removePeer,
    addStream,
    removeStream,
  } = useStore();

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [peers, setPeers] = useState<Record<string, SimplePeer.Instance>>({});
  const [remoteStreams, setRemoteStreams] = useState<Record<string, MediaStream>>({});

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const peersRef = useRef<Record<string, SimplePeer.Instance>>({});

  // Get participants from the store
  const participants = videoCall.participants
    .map((id) => otherUsers.find((user) => user.id === id))
    .filter(Boolean);

  // Initialize media and socket listeners
  useEffect(() => {
    const startMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        setLocalStream(stream);

        // Display local video
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        // Create peer connections for each participant
        participants.forEach((participant) => {
          if (participant && participant.socketId) {
            createPeer(participant.socketId, stream);
          }
        });

        // Listen for new users joining the call
        socket.on('user-joined-call', (data: { userId: string }) => {
          const user = otherUsers.find((u) => u.socketId === data.userId);
          if (user) {
            createPeer(data.userId, stream);
          }
        });

        // Listen for call signals
        socket.on('call-signal', (data: { from: string; signal: any }) => {
          const peer = peersRef.current[data.from];

          if (peer) {
            peer.signal(data.signal);
          } else {
            // If we don't have a peer for this user yet, they're initiating a call to us
            addPeerFromSignal(data.from, data.signal, stream);
          }
        });
      } catch (err) {
        console.error('Error accessing media devices:', err);
      }
    };

    startMedia();

    // Cleanup function
    return () => {
      // Stop local stream
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }

      // Close all peer connections
      Object.values(peersRef.current).forEach((peer) => {
        if (peer) {
          peer.destroy();
        }
      });

      // Remove socket listeners
      if (socket && typeof socket.off === 'function') {
        socket.off('user-joined-call');
        socket.off('call-signal');
      }
    };
  }, [localStream, participants, otherUsers]);

  // Helper function to set up a peer connection
  const setupPeer = (userId: string, stream: MediaStream, initiator: boolean, signal?: any) => {
    const peer = new SimplePeer({
      initiator,
      trickle: false,
      stream,
    });

    peer.on('signal', (signal) => {
      socket.emit('call-signal', {
        to: userId,
        from: socket.id,
        signal,
      });
    });

    peer.on('stream', (remoteStream) => {
      setRemoteStreams((prev) => ({
        ...prev,
        [userId]: remoteStream,
      }));
      addStream(userId, remoteStream);
    });

    peer.on('close', () => {
      removePeer(userId);
      setRemoteStreams((prev) => {
        const newStreams = { ...prev };
        delete newStreams[userId];
        return newStreams;
      });
      removeStream(userId);
    });

    peer.on('error', (err) => {
      console.error('Peer error:', err);
      removePeer(userId);
    });

    if (signal) {
      peer.signal(signal);
    }

    peersRef.current[userId] = peer;
    setPeers((prev) => ({ ...prev, [userId]: peer }));
    addPeer(userId, peer);

    return peer;
  };

  const createPeer = (userId: string, stream: MediaStream) => {
    return setupPeer(userId, stream, true);
  };

  const addPeerFromSignal = (userId: string, signal: any, stream: MediaStream) => {
    return setupPeer(userId, stream, false, signal);
  };

  const toggleMute = () => {
    if (localStream) {
      const audioTracks = localStream.getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTracks = localStream.getVideoTracks();
      videoTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  const handleEndCall = () => {
    // Close all peer connections
    Object.values(peersRef.current).forEach((peer) => {
      if (peer) {
        peer.destroy();
      }
    });

    // Stop local stream
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }

    // End call in store
    endVideoCall();

    // Close modal
    onClose();
  };

  const inviteUser = (userId: number) => {
    const user = otherUsers.find((u) => u.id === userId);

    if (!user || !user.socketId) {
      console.error('User not found or missing socketId');
      return;
    }

    if (!localStream) {
      console.error('Local stream not available');
      return;
    }

    createPeer(user.socketId, localStream);
    socket.emit('invite-to-call', { userId: user.id });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center">
      <div className="bg-gray-900 rounded-xl w-full max-w-5xl h-[80vh] flex flex-col overflow-hidden">
        <div className="p-4 flex justify-between items-center border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Video Call</h2>
          <div className="flex items-center space-x-2">
            <button
              className="bg-indigo-600 text-white px-3 py-1 rounded-md flex items-center space-x-1 hover:bg-indigo-700"
              onClick={() => {
                // Show user list to invite
                const nonParticipants = otherUsers.filter(
                  (user) => !videoCall.participants.includes(user.id)
                );

                if (nonParticipants.length > 0) {
                  inviteUser(nonParticipants[0].id);
                }
              }}
            >
              <UserPlus size={16} />
              <span>Invite</span>
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="flex-1 p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Local video */}
          <div className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded text-white text-sm">
              {currentUser?.name} (You)
            </div>
            {isVideoOff && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-70">
                <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white overflow-hidden">
                  <img
                    src={`https://api.dicebear.com/7.x/fun-emoji/svg?seed=${currentUser?.name}`}
                    alt="Your avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Remote videos */}
          {Object.entries(remoteStreams).map(([userId, stream]) => {
            const user = otherUsers.find((u) => u.socketId === userId);

            return (
              <div key={userId} className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video">
                <video
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                  ref={(el) => {
                    if (el && stream) {
                      el.srcObject = stream;
                    }
                  }}
                />
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded text-white text-sm">
                  {user?.name || 'Unknown User'}
                </div>
              </div>
            );
          })}

          {/* Placeholder videos for participants without streams yet */}
          {participants
            .filter((p) => p && p.socketId && !remoteStreams[p.socketId])
            .map((user) => (
              <div key={user?.id} className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video">
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                  <div className="w-20 h-20 rounded-full overflow-hidden">
                    <img
                      src={`https://api.dicebear.com/7.x/fun-emoji/svg?seed=${user?.name}`}
                      alt={`${user?.name}'s avatar`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded text-white text-sm">
                  {user?.name} (Connecting...)
                </div>
              </div>
            ))}
        </div>

        <div className="p-4 flex justify-center space-x-4 border-t border-gray-700">
          <button
            onClick={toggleMute}
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
          </button>

          <button
            onClick={toggleVideo}
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isVideoOff ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            {isVideoOff ? <VideoOff size={20} /> : <VideoIcon size={20} />}
          </button>

          <button
            onClick={handleEndCall}
            className="w-12 h-12 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center"
          >
            <PhoneOff size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;