'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import { Send, Paperclip, Upload, Bot, FileSpreadsheet, FileText, Mail, Image, MessageCircle, Mic, MicOff, X } from 'lucide-react';

interface BottomCommandBarProps {
  placeholder?: string;
  onSubmit?: (input: string) => void;
  processing?: boolean;
  agentThinking?: string;
}

const fileTypes = [
  { icon: <FileSpreadsheet size={16} />, label: 'Excel', accept: '.xlsx,.xls,.csv' },
  { icon: <FileText size={16} />, label: 'PDF', accept: '.pdf' },
  { icon: <Mail size={16} />, label: '邮件', accept: '.eml,.msg' },
  { icon: <Image size={16} />, label: '截图', accept: 'image/*' },
  { icon: <MessageCircle size={16} />, label: '微信', accept: 'image/*' },
];

export function BottomCommandBar({
  placeholder = '今天你想完成什么？输入指令或上传文件...',
  onSubmit, processing = false, agentThinking,
}: BottomCommandBarProps) {
  const [input, setInput] = useState('');
  const [focused, setFocused] = useState(false);
  const [recording, setRecording] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [parsedFiles, setParsedFiles] = useState<{ name: string; content: string; category: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const isActive = focused || input.length > 0 || parsedFiles.length > 0;

  const handleSubmit = () => {
    const parts: string[] = [];
    if (input.trim()) parts.push(input.trim());
    if (parsedFiles.length > 0) {
      parts.push(...parsedFiles.map((f) => `[${f.category}: ${f.name}]\n${f.content}`));
    }
    const msg = parts.join('\n\n');
    if (msg && onSubmit) { onSubmit(msg); setInput(''); setParsedFiles([]); }
  };

  // 文件解析
  const uploadAndParse = async (file: File) => {
    setParsedFiles((prev) => [...prev, { name: file.name, content: '解析中...', category: '加载中' }]);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const res = await fetch(`${apiUrl}/api/parse`, { method: 'POST', body: formData });
      if (!res.ok) throw new Error('解析失败');
      const data = await res.json();
      setParsedFiles((prev) => prev.map((p, i) =>
        i === prev.length - 1
          ? { name: file.name, content: data.data?.content || '[无内容]', category: data.data?.category || '文件' }
          : p,
      ));
    } catch {
      setParsedFiles((prev) => prev.map((p, i) =>
        i === prev.length - 1
          ? { name: file.name, content: '[解析失败]', category: '错误' }
          : p,
      ));
    }
  };

  // 粘贴截图
  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of Array.from(items)) {
      if (item.type.startsWith('image/')) {
        e.preventDefault();
        const blob = item.getAsFile();
        if (blob) uploadAndParse(new File([blob], `clipboard-${Date.now()}.png`, { type: 'image/png' }));
        return;
      }
    }
  }, []);

  // 全局粘贴监听
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = (e: Event) => handlePaste(e as unknown as React.ClipboardEvent);
    el.addEventListener('paste', handler);
    return () => el.removeEventListener('paste', handler);
  }, [handlePaste]);

  // 拖拽文件
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragOver(true); };
  const handleDragLeave = () => setDragOver(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const files = e.dataTransfer?.files;
    if (!files) return;
    for (const file of Array.from(files)) uploadAndParse(file);
  };

  // 文件选择
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadAndParse(file);
    e.target.value = '';
  };

  // 语音
  const toggleRecording = async () => {
    if (recording) { mediaRecorderRef.current?.stop(); setRecording(false); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => { stream.getTracks().forEach((t) => t.stop()); setInput((p) => p + ' [语音输入]'); };
      mediaRecorderRef.current = recorder;
      recorder.start(); setRecording(true);
      setTimeout(() => { if (recorder.state === 'recording') { recorder.stop(); setRecording(false); } }, 30000);
    } catch { alert('无法访问麦克风'); }
  };

  return (
    <div className="border-t border-[#E8EAED] bg-white" ref={containerRef} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
      <input ref={fileInputRef} type="file" className="hidden" accept=".xlsx,.xls,.csv,.pdf,.txt,.md,.json,.png,.jpg,.jpeg,.webp" onChange={handleFileSelect} />

      {processing && agentThinking && (
        <div className="px-5 py-2 flex items-center gap-2.5 text-[14px] text-brand-600 bg-brand-50 border-b border-brand-100">
          <span className="w-2 h-2 bg-brand-500 rounded-full" style={{ animation: 'pulse-dot 1.2s infinite' }} />
          <span className="w-2 h-2 bg-brand-500 rounded-full" style={{ animation: 'pulse-dot 1.2s infinite', animationDelay: '200ms' }} />
          <span className="w-2 h-2 bg-brand-500 rounded-full" style={{ animation: 'pulse-dot 1.2s infinite', animationDelay: '400ms' }} />
          {agentThinking}
        </div>
      )}

      {/* 拖拽覆盖层 */}
      {dragOver && (
        <div className="absolute inset-0 bg-brand-50/90 border-2 border-dashed border-brand-400 rounded-xl flex items-center justify-center z-50">
          <div className="text-center"><Upload size={32} className="mx-auto text-brand-500 mb-2" /><p className="text-[14px] text-brand-600 font-medium">释放文件以解析</p></div>
        </div>
      )}

      <div className="px-5 pt-4 pb-4">
        <div className={`px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl transition-all duration-200 ${isActive ? 'border-brand-300 shadow-[0_0_0_3px_rgba(43,111,242,0.1)] bg-white py-4' : ''} ${dragOver ? 'ring-2 ring-brand-300' : ''}`}>
          {/* 已解析文件列表 */}
          {parsedFiles.length > 0 && (
            <div className="mb-3 space-y-2">
              {parsedFiles.map((f, i) => (
                <div key={i} className="flex items-start gap-2 px-3 py-2 bg-brand-50 text-brand-700 rounded-lg text-[14px]">
                  <FileText size={14} className="mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2"><span className="font-medium truncate">{f.name}</span><span className="text-[13px] text-brand-400">{f.category}</span></div>
                    {f.content !== '解析中...' && <p className="text-[13px] text-brand-600 mt-0.5 line-clamp-2">{f.content.slice(0, 100)}</p>}
                  </div>
                  <button onClick={() => setParsedFiles((p) => p.filter((_, j) => j !== i))} className="text-brand-400 hover:text-brand-600 shrink-0"><X size={14} /></button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3">
            <div className="shrink-0 self-start mt-0.5">
              <div className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center"><Bot size={18} className="text-brand-600" /></div>
            </div>

            <div className="flex-1 min-w-0">
              {isActive ? (
                <textarea value={input} onChange={e => setInput(e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }}
                  placeholder={placeholder} rows={2}
                  className="w-full bg-transparent border-none outline-none resize-none text-[15px] text-gray-900 placeholder:text-gray-400 leading-relaxed"
                  disabled={processing} autoFocus />
              ) : (
                <input type="text" value={input} onChange={e => setInput(e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  placeholder={placeholder}
                  className="w-full bg-transparent border-none outline-none text-[15px] text-gray-900 placeholder:text-gray-400"
                  disabled={processing} />
              )}

              {!isActive && (
                <div className="flex items-center justify-center gap-1 mt-2.5 pt-2.5 border-t border-gray-100">
                  {fileTypes.map((ft, i) => (
                    <button key={i} onClick={() => { if (fileInputRef.current) { fileInputRef.current.accept = ft.accept; fileInputRef.current.click(); } }}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-white transition-colors" title={ft.label}>
                      {ft.icon}<span className="text-[13px] font-medium">{ft.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-0.5 shrink-0 self-start mt-0.5">
              <button onClick={toggleRecording}
                className={`p-1.5 rounded-lg transition-colors ${recording ? 'text-red-500 bg-red-50 animate-pulse' : 'text-gray-400 hover:bg-gray-200/50'}`} title={recording ? '停止录音' : '语音输入'}>
                {recording ? <MicOff size={18} /> : <Mic size={18} />}
              </button>
              <button onClick={() => fileInputRef.current?.click()} className="p-1.5 rounded-lg hover:bg-gray-200/50 text-gray-400 transition-colors" title="附件"><Paperclip size={18} /></button>
              <button onClick={() => fileInputRef.current?.click()} className="p-1.5 rounded-lg hover:bg-gray-200/50 text-gray-400 transition-colors" title="上传"><Upload size={18} /></button>
              <button onClick={handleSubmit} disabled={(!input.trim() && parsedFiles.length === 0) || processing}
                className="p-1.5 rounded-lg text-brand-500 hover:bg-brand-50 disabled:text-gray-300 disabled:hover:bg-transparent transition-colors"><Send size={18} /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
