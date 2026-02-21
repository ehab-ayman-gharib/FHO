import { useEffect, useRef, useState } from 'react';
import { createMediaStreamSource, Transform2D } from '@snap/camera-kit';
import { CAMERAKIT_CONFIG } from '../config/camerakit';
import { bootstrapCameraKitWithRemoteAPI } from '../RemoteAPI';

export const CameraKitWrapper = () => {
    // Refs and State
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const sessionRef = useRef<any>(null);
    const cameraKitRef = useRef<any>(null);
    // Media Stream Ref
    const streamRef = useRef<MediaStream | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    // Camera State
    const [isSessionReady, setIsSessionReady] = useState(false);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [currentLensId, setCurrentLensId] = useState<string>(CAMERAKIT_CONFIG.DEFAULT_LENS_ID);
    const [showFlash, setShowFlash] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
    //@ts-ignore
    const [birthDate, setBirthDate] = useState<string>(() => {
        const params = new URLSearchParams(window.location.search);
        return params.get('birthdate') || '70';
    });
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const recordingChunksRef = useRef<Blob[]>([]);
    const holdTimerRef = useRef<any>(null);

    // Audio Refs
    const shutterSound = useRef<HTMLAudioElement | null>(null);

    // Initialize Audio
    useEffect(() => {
        shutterSound.current = new Audio('/sounds/shutter.mp3');

        // Preload sounds
        shutterSound.current.load();
    }, []);

    // Listen for Remote API share event from the lens
    useEffect(() => {
        const handleShare = async () => {
            if (!canvasRef.current) return;

            try {
                // Play shutter sound
                if (shutterSound.current) {
                    shutterSound.current.currentTime = 0;
                    shutterSound.current.play().catch(e => console.warn("Audio play prevented", e));
                }

                // Trigger flash effect
                setShowFlash(true);
                setTimeout(() => setShowFlash(false), 300);

                // Small delay to let the flash show before capture
                await new Promise(resolve => setTimeout(resolve, 50));

                // Capture canvas to blob
                const blob = await new Promise<Blob | null>((resolve) => {
                    canvasRef.current!.toBlob(resolve, 'image/png', 1.0);
                });

                if (!blob) {
                    console.error('Failed to capture canvas');
                    return;
                }

                const file = new File([blob], 'aging-lens-photo.png', { type: 'image/png' });

                // Use native share if available
                if (navigator.share && navigator.canShare?.({ files: [file] })) {
                    await navigator.share({
                        title: 'FHO Aging Lens',
                        text: 'Check out my aging lens photo!',
                        files: [file],
                    });
                    console.log('Shared successfully');
                } else {
                    // Fallback: download the image
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'aging-lens-photo.png';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    console.log('Image downloaded (share not supported on this device)');
                }
            } catch (err: any) {
                // User cancelled the share sheet — this is not an error
                if (err?.name === 'AbortError') {
                    console.log('Share cancelled by user');
                } else {
                    console.error('Share failed:', err);
                }
            }
        };

        window.addEventListener('camerakit-share', handleShare);
        return () => window.removeEventListener('camerakit-share', handleShare);
    }, []);


    //@ts-ignore
    // Handle lens selection
    const handleSelectLens = (lensId: string) => {
        console.log('Selected lens:', lensId);
        setCurrentLensId(lensId);
    };


    // Handle take photo / record video
    const handleShutterDown = () => {
        // Start a timer to detect long press (hold)
        holdTimerRef.current = setTimeout(() => {
            startRecording();
        }, 500); // Hold for 500ms to start recording
    };

    const handleShutterUp = () => {
        if (holdTimerRef.current) {
            clearTimeout(holdTimerRef.current);
            holdTimerRef.current = null;
        }

        if (isRecording) {
            stopRecording();
        } else {
            handleTakePhoto();
        }
    };

    const handleTakePhoto = () => {
        if (canvasRef.current) {
            try {
                // Play shutter sound
                if (shutterSound.current) {
                    shutterSound.current.currentTime = 0;
                    shutterSound.current.play().catch(e => console.warn("Audio play prevented", e));
                }

                // Trigger flash
                setShowFlash(true);

                // Capture image
                const dataUrl = canvasRef.current.toDataURL('image/png', 1.0);

                // Show photo after a brief delay to match the flash
                setTimeout(() => {
                    setCapturedImage(dataUrl);
                    setShowFlash(false);
                }, 150);
            } catch (e) {
                console.error("Failed to capture image", e);
                setShowFlash(false);
            }
        }
    };

    const startRecording = () => {
        if (!canvasRef.current) return;

        try {
            // @ts-ignore
            const stream = canvasRef.current.captureStream(30);
            const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });

            mediaRecorderRef.current = recorder;
            recordingChunksRef.current = [];

            recorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    recordingChunksRef.current.push(e.data);
                }
            };

            recorder.onstop = () => {
                const blob = new Blob(recordingChunksRef.current, { type: 'video/webm' });
                const url = URL.createObjectURL(blob);
                setRecordedVideoUrl(url);
                setIsRecording(false);
            };

            recorder.start();
            setIsRecording(true);
        } catch (e) {
            console.error("Failed to start recording", e);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
        }
    };

    // Handle close photo or video
    const handleClosePreview = () => {
        setCapturedImage(null);
        setRecordedVideoUrl(null);
    };
    // Effects
    useEffect(() => {
        let isMounted = true;
        let session: any;
        // Initialize CameraKit and Session
        const initCameraKit = async () => {
            try {
                const apiToken = CAMERAKIT_CONFIG.API_TOKEN;
                // @ts-ignore
                if (apiToken === 'YOUR_API_TOKEN_HERE' || !apiToken) {
                    console.warn('Camera Kit: Please provide a valid API Token.');
                    if (isMounted) setError('Please configure your API Token in src/components/CameraKitWrapper.tsx');
                    return;
                }

                const cameraKit = await bootstrapCameraKitWithRemoteAPI();
                cameraKitRef.current = cameraKit;
                if (!isMounted) return;

                if (!canvasRef.current) return;

                session = await cameraKit.createSession({ liveRenderTarget: canvasRef.current });
                sessionRef.current = session;

                if (!isMounted) {
                    session.pause();
                    return;
                }

                session.events.addEventListener('error', (event: any) => {
                    console.error('Camera Kit Session Error:', event.detail.error);
                    if (isMounted) setError(event.detail.error.message);
                });

                if (isMounted) {
                    // Set session ready
                    setIsSessionReady(true);
                }

            } catch (err: any) {
                console.error('Camera Kit Initialization Error:', err);
                if (isMounted) setError(err.message || 'Failed to initialize Camera Kit');
            }
        };

        initCameraKit();
        // Cleanup on unmount
        return () => {
            isMounted = false;
            // Cleanup
            if (sessionRef.current) {
                sessionRef.current.pause();
            }
        };
    }, []);
    // Camera Stream Effect
    useEffect(() => {
        if (!isSessionReady || !sessionRef.current) return;
        let isMounted = true;
        // Initialize Camera Stream
        const initStream = async () => {
            try {
                // Stop previous stream if it exists
                if (streamRef.current) {
                    streamRef.current.getTracks().forEach(track => track.stop());
                }

                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'user' }
                });

                if (!isMounted) {
                    stream.getTracks().forEach(track => track.stop());
                    return;
                }

                streamRef.current = stream;

                const source = createMediaStreamSource(stream, {
                    transform: Transform2D.MirrorX,
                    cameraType: 'user'
                });

                await sessionRef.current.setSource(source);
                await sessionRef.current.play();
                await source.setRenderSize(1080, 1920);

                // Don't hide loader here - let the lens application effect handle it
                // so the loader stays visible until the lens is fully applied
            } catch (err: any) {
                console.error('Camera Stream Error:', err);
                if (isMounted) setError(err.message || 'Failed to start camera stream');
            }
        };



        initStream();
        // Cleanup on unmount
        return () => {
            isMounted = false;
            // Stop stream
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, [isSessionReady]);
    // Lens Apply Effect, this effect is responsible for applying the lens to the camera stream
    useEffect(() => {
        if (!isSessionReady || !cameraKitRef.current || !sessionRef.current) return;
        let isMounted = true;

        const applyLens = async () => {
            try {
                // Show loader while applying lens
                if (isMounted) setIsLoading(true);

                // Attempt to remove the current lens before loading the new one
                // We check if the method exists to avoid runtime errors if the SDK version differs
                if (sessionRef.current.removeLens) {
                    console.log('Removing current lens...');
                    await sessionRef.current.removeLens();
                }

                console.log('Loading lens:', currentLensId);
                const lens = await cameraKitRef.current.lensRepository.loadLens(currentLensId, CAMERAKIT_CONFIG.GROUP_ID);

                if (!isMounted) return;

                console.log('Applying lens:', currentLensId, 'with birthDate:', birthDate);
                await sessionRef.current.applyLens(lens, {
                    launchParams: {
                        birthDate: birthDate
                    }
                });
                console.log('Lens applied successfully:', currentLensId);

                // Hide loader after lens is applied
                if (isMounted) setIsLoading(false);
            } catch (e) {
                console.error('Failed to apply lens:', e);
                // Hide loader on error as well
                if (isMounted) {
                    setIsLoading(false);
                    // Optional: handle specific error states here
                }
            }
        };

        applyLens();
        // Cleanup on unmount
        return () => {
            isMounted = false;
        };
    }, [currentLensId, isSessionReady, birthDate]);
    // Error Handling 
    if (error) {
        return (
            <div className="flex flex-col justify-center items-center h-screen text-red-600 bg-[#1a1a1a] p-5 text-center">
                <h2 className="text-2xl font-bold mb-4">{error}</h2>
                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        // Camera Container
        <div className="relative w-screen h-screen bg-black overflow-hidden select-none">
            <canvas
                ref={canvasRef}
                id="CameraKit-AR-Canvas"
                className="absolute inset-0 w-full h-full block object-cover z-0"
            />
            {/* Captured Image/Video Preview */}
            {(capturedImage || recordedVideoUrl) && (
                <div className="fixed inset-0 z-50 bg-black animate-photoAppear">
                    {capturedImage ? (
                        <img src={capturedImage} alt="Captured" className="w-full h-full object-cover block" />
                    ) : (
                        <video src={recordedVideoUrl!} controls autoPlay loop className="w-full h-full object-cover block" />
                    )}
                    <button
                        className="absolute top-6 left-6 z-[60] w-11 h-11 flex items-center justify-center bg-black/50 backdrop-blur-lg rounded-full text-white border border-white/20 cursor-pointer pointer-events-auto active:scale-90 transition-all duration-200 p-0"
                        onClick={handleClosePreview}
                        aria-label="Close Preview"
                    >
                        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                        </svg>
                    </button>
                </div>
            )}

            {/* Flash Effect */}
            {showFlash && <div className="fixed inset-0 bg-white z-[100] pointer-events-none animate-flashAnim" />}

            {/* Loading Overlay */}
            {isLoading && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] flex flex-col justify-center items-center z-[2000] text-white">
                    <div className="w-[50px] h-[50px] border-[5px] border-white/30 border-t-white rounded-full animate-spin mb-5"></div>
                </div>
            )}

            {/* UI Overlay */}
            {(!capturedImage && !recordedVideoUrl) ? (
                <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-5 z-10 font-sans">
                    {/* Top Bar - Hidden/Empty as flip camera is removed */}
                    <div className="flex justify-end pt-2.5 pointer-events-auto">
                    </div>

                    {/* Bottom Controls */}
                    <div className="flex flex-col items-center w-full pb-[30px] pointer-events-auto relative">
                        {isRecording && (
                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-red-600/90 text-white px-3 py-1 rounded font-bold text-xs tracking-widest animate-blink uppercase z-20">
                                REC
                            </div>
                        )}

                        <div className="grid grid-cols-[1fr_auto_1fr] items-center w-full max-w-[440px] px-5 gap-5">
                            <div className="w-full" />

                            <button
                                className={`hidden relative w-[76px] h-[76px] p-0 rounded-full border-[3px] flex items-center justify-center cursor-pointer transition-all duration-200 backdrop-blur-[2px] active:scale-90 ${isRecording ? 'border-red-500 bg-red-500/20 shadow-[0_0_0_8px_rgba(255,75,43,0.3)] animate-recordingRipple' : 'border-white/90 bg-white/10 after:content-[""] after:absolute after:inset-0 after:border-2 after:border-white/80 after:rounded-full after:animate-idleRipple'
                                    }`}
                                aria-label="Take Photo or Record"
                                onMouseDown={handleShutterDown}
                                onMouseUp={handleShutterUp}
                                onTouchStart={handleShutterDown}
                                onTouchEnd={handleShutterUp}
                            >
                                <div className={`transition-all duration-300 transform-gpu ${isRecording ? 'w-6 h-6 bg-red-500 rounded-sm' : 'w-[60px] h-[60px] bg-white rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.2)]'
                                    }`} />
                            </button>

                            <div className="w-full" />
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
};
