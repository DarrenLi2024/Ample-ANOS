'use client';
import { useState, useRef } from 'react';
import { Send, Paperclip, Upload, Bot, FileSpreadsheet, FileText, Mail, Image, MessageCircle, Mic, MicOff } from 'lucide-react';

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
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const isActive = focused || input.length > 0 || !!uploadedFile;

  const handleSubmit = () => {
    const message = input.trim() || (uploadedFile ? `已上传: ${uploadedFile.name}` : '');
    if (message && onSubmit) { onSubmit(message); setInput(''); setUploadedFile(null); }
  };

  // 文件上传
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFile({ name: file.name, size: file.size });
    // TODO Phase 2: 实际上传到 API /api/upload
    e.target.value = '';
  };

  // 语音输入
  const toggleRecording = async () => {
    if (recording) {
      mediaRecorderRef.current?.stop();
      setRecording(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        // TODO Phase 2: 发送音频到 STT 服务
        setInput((prev) => prev + ' [语音输入 — Phase 2 对接 STT]');
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setRecording(true);

      // 最长录音 30 秒
      setTimeout(() => { if (recorder.state === 'recording') recorder.stop(); setRecording(false); }, 30000);
    } catch {
      alert('无法访问麦克风。请在浏览器设置中允许麦克风权限。');
    }
  };

  return (
    <div className="border-t border-[#E8EAED] bg-white">
      {/* 隐藏的文件input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".xlsx,.xls,.csv,.pdf,.png,.jpg,.jpeg,.webp,.txt"
        onChange={handleFileUpload}
      />

      {processing && agentThinking && (
        <div className="px-5 py-2 flex items-center gap-2.5 text-sm text-brand-600 bg-brand-50 border-b border-brand-100">
          <span className="w-2 h-2 bg-brand-500 rounded-full" style={{ animation: 'pulse-dot 1.2s infinite' }} />
          <span className="w-2 h-2 bg-brand-500 rounded-full" style={{ animation: 'pulse-dot 1.2s infinite', animationDelay: '200ms' }} />
          <span className="w-2 h-2 bg-brand-500 rounded-full" style={{ animation: 'pulse-dot 1.2s infinite', animationDelay: '400ms' }} />
          {agentThinking}
        </div>
      )}

      <div className="px-5 pt-4 pb-4">
        <div className={`
          px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl
          transition-all duration-200
          ${isActive ? 'border-brand-300 shadow-[0_0_0_3px_rgba(43,111,242,0.1)] bg-white py-4' : ''}
        `}>
          {/* 已上传文件提示 */}
          {uploadedFile && (
            <div className="mb-2 px-3 py-1.5 bg-brand-50 text-brand-700 rounded-lg text-sm flex items-center gap-2">
              <FileText size={14} />
              <span>{uploadedFile.name}</span>
              <span className="text-brand-400">({(uploadedFile.size / 1024).toFixed(1)}KB)</span>
              <button onClick={() => setUploadedFile(null)} className="ml-auto text-brand-400 hover:text-brand-600">✕</button>
            </div>
          )}

          <div className="flex items-center gap-3">
            {/* Bot 图标 */}
            <div className="shrink-0 self-start mt-0.5">
              <div className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center">
                <Bot size={18} className="text-brand-600" />
              </div>
            </div>

            {/* 输入区 */}
            <div className="flex-1 min-w-0">
              {isActive ? (
                <textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault(); handleSubmit();
                    }
                  }}
                  placeholder={placeholder}
                  rows={2}
                  className="w-full bg-transparent border-none outline-none resize-none text-base text-gray-900 placeholder:text-gray-400 leading-relaxed"
                  disabled={processing}
                  autoFocus
                />
              ) : (
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  placeholder={placeholder}
                  className="w-full bg-transparent border-none outline-none text-base text-gray-900 placeholder:text-gray-400"
                  disabled={processing}
                />
              )}

              {/* 文件类型图标行 — 默认态 */}
              {!isActive && (
                <div className="flex items-center gap-1 mt-2.5 pt-2.5 border-t border-gray-100">
                  {fileTypes.map((ft, i) => (
                    <button
                      key={i}
                      onClick={() => { fileInputRef.current?.setAttribute('accept', ft.accept); fileInputRef.current?.click(); }}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-white transition-colors"
                      title={ft.label}
                    >
                      {ft.icon}
                      <span className="text-xs font-medium">{ft.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 右侧操作图标 */}
            <div className="flex items-center gap-0.5 shrink-0 self-start mt-0.5">
              {/* 语音输入按钮 */}
              <button
                onClick={toggleRecording}
                className={`p-1.5 rounded-lg transition-colors ${recording ? 'text-red-500 bg-red-50 animate-pulse' : 'text-gray-400 hover:bg-gray-200/50'}`}
                title={recording ? '停止录音' : '语音输入'}
              >
                {recording ? <MicOff size={18} /> : <Mic size={18} />}
              </button>

              <button onClick={() => fileInputRef.current?.click()} className="p-1.5 rounded-lg hover:bg-gray-200/50 text-gray-400 transition-colors" title="附件">
                <Paperclip size={18} />
              </button>
              <button onClick={() => fileInputRef.current?.click()} className="p-1.5 rounded-lg hover:bg-gray-200/50 text-gray-400 transition-colors" title="上传">
                <Upload size={18} />
              </button>
              <button
                onClick={handleSubmit}
                disabled={!input.trim() && !uploadedFile || processing}
                className="p-1.5 rounded-lg text-brand-500 hover:bg-brand-50 disabled:text-gray-300 disabled:hover:bg-transparent transition-colors"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
