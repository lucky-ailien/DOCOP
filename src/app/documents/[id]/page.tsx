import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Editor from '@/components/Editor';

const DocumentDetailPage = () => {
  const params = useParams();
  const documentId = params.id as string;
  
  const [title, setTitle] = useState('我的文档');
  const [isSaving, setIsSaving] = useState(false);

  // 保存文档
  const handleSave = async () => {
    setIsSaving(true);
    // 模拟保存操作
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsSaving(false);
    alert('文档已保存');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-gray-900">Docop</h1>
          <span className="text-sm text-gray-500">实时协作文档</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            分享
          </button>
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-sm font-medium">U</span>
          </div>
        </div>
      </header>
      <main className="max-w-5xl mx-auto py-8">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <input
              type="text"
              className="text-3xl font-bold border-none outline-none bg-transparent"
              placeholder="文档标题"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <button 
              className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 text-sm"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? '保存中...' : '保存'}
            </button>
          </div>
          <div className="text-sm text-gray-500">
            最后编辑于 {new Date().toLocaleString()}
          </div>
        </div>
        <Editor documentId={documentId} />
      </main>
    </div>
  );
};

export default DocumentDetailPage;