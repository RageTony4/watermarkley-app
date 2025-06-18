import React, { useState, useRef, useEffect, useCallback } from 'react';

// SVG Icons as React Components
const UploadIcon = () => <svg className="w-10 h-10 mb-3 text-gray-400" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>;
const ImageIcon = () => <svg className="w-8 h-8 mb-2 text-gray-400" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14"></path></svg>;
const TypeIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7V4h16v3M9 20h6M12 4v16"></path></svg>;
const RepeatIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 1l4 4-4 4M3 11V9a4 4 0 014-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 01-4 4H3"></path></svg>;
const SquareIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4h16v16H4z"></path></svg>;
const DownloadIcon = () => <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>;
const UndoIcon = () => <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 15l-3-3m0 0l3-3m-3 3h8A5 5 0 0118 9v2"></path></svg>;
const RedoIcon = () => <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 15l3-3m0 0l-3-3m3 3H8A5 5 0 003 9v2"></path></svg>;
const SaveIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1-4l-3 3m0 0l-3-3m3 3V3"></path></svg>;
const TrashIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>;
const CoffeeIcon = () => <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547a2 2 0 00-.547 1.806l.443 2.216a2 2 0 001.212 1.547l.547.273a2 2 0 001.806-.547l2.216-4.431a2 2 0 011.547-1.212l.273-.547a2 2 0 011.806-.547l2.216 4.431a2 2 0 001.547 1.212l.547.273a2 2 0 001.806-.547l.443-2.216a2 2 0 00-.547-1.806z"></path></svg>;

// Type Definitions
interface WatermarkSettings {
    watermarkType: "text" | "logo" | "repeatingText" | "repeatingLogo" | "border";
    text: string;
    fontFamily: string;
    opacity: number;
    fontSize: number;
    rotation: number;
    color: string;
    addStroke: boolean;
    position: string;
}

interface UploadedFile {
    file: File;
    name: string;
}

const initialSettings: WatermarkSettings = {
    watermarkType: "text",
    text: "© Your Name 2025",
    fontFamily: "Arial",
    opacity: 0.5,
    fontSize: 40,
    rotation: 0,
    color: "#ffffff",
    addStroke: false,
    position: "center-center",
};

const watermarkTypes = [
    { id: "text", label: "Text", icon: TypeIcon },
    { id: "logo", label: "Logo", icon: ImageIcon },
    { id: "repeatingText", label: "Repeating Text", icon: RepeatIcon },
    { id: "repeatingLogo", label: "Repeating Logo", icon: RepeatIcon },
    { id: "border", label: "Border", icon: SquareIcon },
];

const fontFamilies = ["Arial", "Verdana", "Georgia", "Times New Roman", "Montserrat", "Playfair Display"];

const positions = [
    "top-left", "top-center", "top-right",
    "center-left", "center-center", "center-right",
    "bottom-left", "bottom-center", "bottom-right",
];

function App() {
    // State Hooks
    const [settings, setSettings] = useState<WatermarkSettings>(initialSettings);
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
    const [activeFileIndex, setActiveFileIndex] = useState(-1);
    const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
    const [logoImage, setLogoImage] = useState<HTMLImageElement | null>(null);
    const [history, setHistory] = useState<WatermarkSettings[]>([initialSettings]);
    const [historyIndex, setHistoryIndex] = useState(0);
    const [presetName, setPresetName] = useState("");
    const [savedPresets, setSavedPresets] = useState<Record<string, WatermarkSettings>>({});
    const [isDragging, setIsDragging] = useState(false);
    const [watermarkPos, setWatermarkPos] = useState({ x: 0.5, y: 0.5 });

    // Refs
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const logoInputRef = useRef<HTMLInputElement>(null);
    const canvasContainerRef = useRef<HTMLDivElement>(null); // Ref for the container

    // Load presets from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem("watermarkley_presets");
        if (stored) {
            setSavedPresets(JSON.parse(stored));
        }
    }, []);

    // Core Drawing and Sizing Logic
    const redrawCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!ctx || !canvas || !originalImage) return;

        // Clear and draw base image
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(originalImage, 0, 0, canvas.width, canvas.height);

        // --- Watermark drawing logic ---
        ctx.save();
        ctx.fillStyle = settings.color;
        ctx.globalAlpha = settings.opacity;
        const scaledFontSize = settings.fontSize * (canvas.width / 1000);
        ctx.font = `bold ${scaledFontSize}px "${settings.fontFamily}", sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const drawText = () => {
            if (!settings.text) return;
            if (settings.addStroke) {
                ctx.lineWidth = 2;
                ctx.strokeStyle = '#000';
                ctx.strokeText(settings.text, 0, 0);
            }
            ctx.fillText(settings.text, 0, 0);
        };

        const drawLogo = () => {
            if (!logoImage) return;
            const logoSize = settings.fontSize * 2 * (canvas.width / 1000);
            ctx.drawImage(logoImage, -logoSize / 2, -logoSize / 2, logoSize, logoSize);
        };

        if (settings.watermarkType.includes("repeating")) {
            const step = scaledFontSize * 4;
            for (let y = -step; y < canvas.height + step; y += step) {
                for (let x = -step; x < canvas.width + step; x += step) {
                    ctx.save();
                    ctx.translate(x, y);
                    ctx.rotate((settings.rotation * Math.PI) / 180);
                    if (settings.watermarkType === "repeatingText") drawText();
                    else if (settings.watermarkType === "repeatingLogo") drawLogo();
                    ctx.restore();
                }
            }
        } else if (settings.watermarkType === "border") {
            const padding = 15;
            const borderFontSize = Math.max(10, (settings.fontSize / 4) * (canvas.width / 1000));
            ctx.font = `${borderFontSize}px "${settings.fontFamily}", sans-serif`;
            ctx.textAlign = "right";
            ctx.textBaseline = "bottom";
            ctx.fillText(settings.text, canvas.width - padding, canvas.height - padding);
        } else {
            let pos;
            if (settings.position !== "custom") {
                const [vert, horiz] = settings.position.split("-");
                const map: Record<string, number> = { top: 0.1, center: 0.5, bottom: 0.9, left: 0.1, right: 0.9 };
                pos = { x: map[horiz] * canvas.width, y: map[vert] * canvas.height };
            } else {
                pos = { x: watermarkPos.x * canvas.width, y: watermarkPos.y * canvas.height };
            }
            
            ctx.translate(pos.x, pos.y);
            ctx.rotate((settings.rotation * Math.PI) / 180);

            if (settings.watermarkType === "text") drawText();
            else if (settings.watermarkType === "logo") drawLogo();
        }
        ctx.restore();
    }, [originalImage, logoImage, settings, watermarkPos]);

    // Effect for Resizing Canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        const container = canvasContainerRef.current;

        const handleResize = () => {
            if (!originalImage || !canvas || !container) return;

            // Calculate scale based on container width
            const containerWidth = container.offsetWidth - 48; // Subtract padding (p-6 = 1.5rem * 2 = 3rem = 48px)
            const scale = Math.min(1, containerWidth / originalImage.width);
            
            const newWidth = originalImage.width * scale;
            const newHeight = originalImage.height * scale;

            if(canvas.width !== newWidth || canvas.height !== newHeight) {
                canvas.width = newWidth;
                canvas.height = newHeight;
                redrawCanvas();
            }
        };

        handleResize(); // Initial resize
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [originalImage, redrawCanvas]);
    
    // Effect for Redrawing Canvas when settings change
    useEffect(() => {
        if(originalImage) {
            redrawCanvas();
        }
    }, [settings, logoImage, redrawCanvas, originalImage]);


    // --- State and Action Handlers ---
    const captureState = useCallback((newSettings: WatermarkSettings) => {
        setHistory(prev => {
            const newHistory = prev.slice(0, historyIndex + 1);
            newHistory.push(newSettings);
            return newHistory;
        });
        setHistoryIndex(prev => prev + 1);
    }, [historyIndex]);
    
    const updateSettings = (newPartialSettings: Partial<WatermarkSettings>) => {
        const newSettings = {...settings, ...newPartialSettings};
        setSettings(newSettings);
        captureState(newSettings);
    }
    
    const handleUndo = () => {
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            setSettings(history[newIndex]);
        }
    };

    const handleRedo = () => {
        if (historyIndex < history.length - 1) {
            const newIndex = historyIndex + 1;
            setHistoryIndex(newIndex);
            setSettings(history[newIndex]);
        }
    };
    
    const loadImage = (file: File) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => setOriginalImage(img);
            img.src = event.target?.result as string;
        };
        reader.readAsDataURL(file);
    };
    
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;
        const newUploadedFiles = files.map(file => ({ file, name: file.name }));
        setUploadedFiles(newUploadedFiles);
        setActiveFileIndex(0);
        loadImage(files[0]);
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                setLogoImage(img);
                updateSettings({ watermarkType: "logo" });
            };
            img.src = event.target?.result as string;
        };
        reader.readAsDataURL(file);
    };

    const downloadImage = (format: "png" | "jpeg") => {
        const canvas = canvasRef.current;
        if (!canvas || activeFileIndex === -1) return;
        const link = document.createElement("a");
        const currentFile = uploadedFiles[activeFileIndex];
        const fileName = currentFile.name.substring(0, currentFile.name.lastIndexOf("."));
        const extension = format === "jpeg" ? "jpg" : "png";
        link.download = `watermarkley_${fileName}.${extension}`;
        link.href = canvas.toDataURL(`image/${format}`, 0.9);
        link.click();
    };

    const savePreset = () => {
        if (!presetName.trim()) return;
        const newPresets = { ...savedPresets, [presetName]: { ...settings } };
        setSavedPresets(newPresets);
        localStorage.setItem("watermarkley_presets", JSON.stringify(newPresets));
        setPresetName("");
    };

    const loadPreset = (name: string) => {
        if (savedPresets[name]) {
             updateSettings({ ...savedPresets[name] });
        }
    };

    const deletePreset = (name: string) => {
        const newPresets = { ...savedPresets };
        delete newPresets[name];
        setSavedPresets(newPresets);
        localStorage.setItem("watermarkley_presets", JSON.stringify(newPresets));
    };


    // --- Render ---
    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
            <div className="container mx-auto max-w-7xl">
                <header className="text-center mb-8">
                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-900" style={{ fontFamily: 'Roboto Slab, serif' }}>Watermarkley</h1>
                    <p className="text-lg text-gray-600 mt-2">Your advanced image watermarking tool.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Controls Panel */}
                    <div className="lg:col-span-4">
                        <div className="bg-white p-6 rounded-lg shadow-lg space-y-6">
                            {/* Upload Section */}
                            <div>
                                <h2 className="text-xl font-semibold mb-4 text-gray-800">1. Upload Images</h2>
                                <label htmlFor="imageLoader" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <UploadIcon />
                                        <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                    </div>
                                    <input id="imageLoader" ref={imageInputRef} name="imageLoader" type="file" className="hidden" accept="image/*" multiple onChange={handleImageUpload}/>
                                </label>
                                <div className="mt-4">
                                    {uploadedFiles.length > 0 && (
                                        <select
                                            className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                            onChange={(e) => {
                                                const index = parseInt(e.target.value);
                                                setActiveFileIndex(index);
                                                loadImage(uploadedFiles[index].file);
                                            }}
                                            value={activeFileIndex}
                                        >
                                            {uploadedFiles.map((file, index) => (
                                                <option key={index} value={index}>{file.name}</option>
                                            ))}
                                        </select>
                                    )}
                                </div>
                            </div>

                            {/* Watermark Type Selection */}
                            <div>
                                <h2 className="text-xl font-semibold mb-4 text-gray-800">2. Watermark Type</h2>
                                <div className="grid grid-cols-3 gap-3">
                                    {watermarkTypes.map((type) => (
                                        <button
                                            key={type.id}
                                            className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 ${settings.watermarkType === type.id ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-300 bg-white text-gray-600 hover:border-blue-400 hover:text-blue-600"}`}
                                            onClick={() => updateSettings({ watermarkType: type.id as any })}
                                        >
                                            <type.icon />
                                            <span className="text-sm font-medium mt-2">{type.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Watermark Settings */}
                            <div>
                                <h2 className="text-xl font-semibold mb-4 text-gray-800">3. Watermark Settings</h2>
                                <div className="space-y-4">
                                    {(settings.watermarkType === "text" || settings.watermarkType === "repeatingText" || settings.watermarkType === "border") && (
                                        <div>
                                            <label htmlFor="watermarkText" className="block text-sm font-medium text-gray-700">Watermark Text</label>
                                            <input
                                                type="text"
                                                id="watermarkText"
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                                value={settings.text}
                                                onChange={(e) => updateSettings({ text: e.target.value })}
                                            />
                                        </div>
                                    )}

                                    {(settings.watermarkType === "logo" || settings.watermarkType === "repeatingLogo") && (
                                        <div>
                                            <label htmlFor="logoLoader" className="block text-sm font-medium text-gray-700 mb-2">Upload Logo</label>
                                            <label htmlFor="logoLoader" className="flex items-center justify-center w-full p-3 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                                <ImageIcon />
                                                <span className="ml-2 text-sm text-gray-500">Click to upload logo</span>
                                                <input id="logoLoader" ref={logoInputRef} name="logoLoader" type="file" className="hidden" accept="image/*" onChange={handleLogoUpload}/>
                                            </label>
                                            {logoImage && <p className="text-sm text-gray-500 mt-2">Logo loaded: {logoImage.src.substring(0, 30)}...</p>}
                                        </div>
                                    )}

                                    <div>
                                        <label htmlFor="fontFamily" className="block text-sm font-medium text-gray-700">Font Family</label>
                                        <select
                                            id="fontFamily"
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                            value={settings.fontFamily}
                                            onChange={(e) => updateSettings({ fontFamily: e.target.value })}
                                        >
                                            {fontFamilies.map((font) => (
                                                <option key={font} value={font}>{font}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="fontSize" className="block text-sm font-medium text-gray-700">Font Size</label>
                                        <input
                                            type="range"
                                            id="fontSize"
                                            min="10" max="200" step="1"
                                            className="mt-1 block w-full"
                                            value={settings.fontSize}
                                            onChange={(e) => updateSettings({ fontSize: parseFloat(e.target.value) })}
                                        />
                                        <span className="text-sm text-gray-500">{settings.fontSize}px</span>
                                    </div>

                                    <div>
                                        <label htmlFor="opacity" className="block text-sm font-medium text-gray-700">Opacity</label>
                                        <input
                                            type="range"
                                            id="opacity"
                                            min="0" max="1" step="0.01"
                                            className="mt-1 block w-full"
                                            value={settings.opacity}
                                            onChange={(e) => updateSettings({ opacity: parseFloat(e.target.value) })}
                                        />
                                        <span className="text-sm text-gray-500">{(settings.opacity * 100).toFixed(0)}%</span>
                                    </div>

                                    <div>
                                        <label htmlFor="rotation" className="block text-sm font-medium text-gray-700">Rotation</label>
                                        <input
                                            type="range"
                                            id="rotation"
                                            min="-180" max="180" step="1"
                                            className="mt-1 block w-full"
                                            value={settings.rotation}
                                            onChange={(e) => updateSettings({ rotation: parseFloat(e.target.value) })}
                                        />
                                        <span className="text-sm text-gray-500">{settings.rotation}°</span>
                                    </div>

                                    <div>
                                        <label htmlFor="color" className="block text-sm font-medium text-gray-700">Color</label>
                                        <input
                                            type="color"
                                            id="color"
                                            className="mt-1 block w-full h-10 border border-gray-300 rounded-md shadow-sm p-1 focus:ring-blue-500 focus:border-blue-500"
                                            value={settings.color}
                                            onChange={(e) => updateSettings({ color: e.target.value })}
                                        />
                                    </div>

                                    {(settings.watermarkType === "text" || settings.watermarkType === "repeatingText" || settings.watermarkType === "border") && (
                                        <div className="flex items-center">
                                            <input
                                                id="addStroke"
                                                type="checkbox"
                                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                checked={settings.addStroke}
                                                onChange={(e) => updateSettings({ addStroke: e.target.checked })}
                                            />
                                            <label htmlFor="addStroke" className="ml-2 block text-sm text-gray-900">Add Stroke</label>
                                        </div>
                                    )}

                                    {(settings.watermarkType === "text" || settings.watermarkType === "logo") && (
                                        <div>
                                            <label htmlFor="position" className="block text-sm font-medium text-gray-700">Position</label>
                                            <select
                                                id="position"
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                                value={settings.position}
                                                onChange={(e) => {
                                                    updateSettings({ position: e.target.value });
                                                    if (e.target.value === "custom") {
                                                        // Optionally reset custom position or keep last one
                                                    }
                                                }}
                                            >
                                                {positions.map((pos) => (
                                                    <option key={pos} value={pos}>{pos.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>
                                                ))}
                                                <option value="custom">Custom (Drag on Image)</option>
                                            </select>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Presets */}
                            <div>
                                <h2 className="text-xl font-semibold mb-4 text-gray-800">4. Presets</h2>
                                <div className="flex space-x-2 mb-4">
                                    <input
                                        type="text"
                                        className="flex-grow border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="New preset name"
                                        value={presetName}
                                        onChange={(e) => setPresetName(e.target.value)}
                                    />
                                    <button
                                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                        onClick={savePreset}
                                    >
                                        <SaveIcon /> Save
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {Object.entries(savedPresets).map(([name, preset]) => (
                                        <div key={name} className="flex items-center justify-between bg-gray-50 p-3 rounded-md border border-gray-200">
                                            <span className="font-medium text-gray-700">{name}</span>
                                            <div>
                                                <button
                                                    className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 mr-2"
                                                    onClick={() => loadPreset(name)}
                                                >
                                                    Load
                                                </button>
                                                <button
                                                    className="px-3 py-1 bg-red-500 text-white text-sm rounded-md hover:bg-red-600"
                                                    onClick={() => deletePreset(name)}
                                                >
                                                    <TrashIcon />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Canvas and Preview Panel */}
                    <div className="lg:col-span-8">
                        <div className="bg-white p-6 rounded-lg shadow-lg h-full flex flex-col">
                            <h2 className="text-xl font-semibold mb-4 text-gray-800">5. Preview & Download</h2>
                            <div ref={canvasContainerRef} className="flex-grow flex items-center justify-center bg-gray-200 rounded-md overflow-hidden relative p-6">
                                {!originalImage && (
                                    <div className="text-center text-gray-500">
                                        <ImageIcon />
                                        <p>Upload an image to start watermarking</p>
                                    </div>
                                )}
                                <canvas
                                    ref={canvasRef}
                                    className="max-w-full max-h-full block"
                                    style={{ cursor: settings.position === "custom" ? (isDragging ? "grabbing" : "grab") : "default" }}
                                    onMouseDown={(e) => {
                                        if (settings.position === "custom" && originalImage) {
                                            setIsDragging(true);
                                            const canvas = canvasRef.current;
                                            if (canvas) {
                                                const rect = canvas.getBoundingClientRect();
                                                const x = (e.clientX - rect.left) / canvas.width;
                                                const y = (e.clientY - rect.top) / canvas.height;
                                                setWatermarkPos({ x, y });
                                            }
                                        }
                                    }}
                                    onMouseMove={(e) => {
                                        if (isDragging && settings.position === "custom" && originalImage) {
                                            const canvas = canvasRef.current;
                                            if (canvas) {
                                                const rect = canvas.getBoundingClientRect();
                                                const x = (e.clientX - rect.left) / canvas.width;
                                                const y = (e.clientY - rect.top) / canvas.height;
                                                setWatermarkPos({ x, y });
                                            }
                                        }
                                    }}
                                    onMouseUp={() => setIsDragging(false)}
                                    onMouseLeave={() => setIsDragging(false)} // Stop dragging if mouse leaves canvas
                                />
                            </div>
                            <div className="mt-4 flex justify-between items-center">
                                <div className="flex space-x-2">
                                    <button
                                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 disabled:opacity-50"
                                        onClick={handleUndo}
                                        disabled={historyIndex === 0}
                                    >
                                        <UndoIcon /> Undo
                                    </button>
                                    <button
                                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 disabled:opacity-50"
                                        onClick={handleRedo}
                                        disabled={historyIndex === history.length - 1}
                                    >
                                        <RedoIcon /> Redo
                                    </button>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                                        onClick={() => downloadImage("png")}
                                        disabled={!originalImage}
                                    >
                                        <DownloadIcon /> Download PNG
                                    </button>
                                    <button
                                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                                        onClick={() => downloadImage("jpeg")}
                                        disabled={!originalImage}
                                    >
                                        <DownloadIcon /> Download JPEG
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <footer className="text-center text-gray-500 text-sm mt-8">
                    <p className="flex items-center justify-center"><CoffeeIcon /> Made with ❤️ by Your Name</p>
                </footer>
            </div>
        </div>
    );
}

export default App;


