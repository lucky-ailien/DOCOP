import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

// 模拟文档数据
const mockDocuments = [
  {
    id: 'doc-1',
    title: '我的第一个文档',
    lastEditedAt: new Date(Date.now() - 3600000),
    collaborators: 2,
    author: 'testuser',
  },
  {
    id: 'doc-2',
    title: '项目计划文档',
    lastEditedAt: new Date(Date.now() - 7200000),
    collaborators: 1,
    author: 'testuser',
  },
  {
    id: 'doc-3',
    title: '会议纪要',
    lastEditedAt: new Date(Date.now() - 10800000),
    collaborators: 3,
    author: 'testuser',
  },
];

const DocumentsPage = () => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [documents, setDocuments] = useState(mockDocuments);
  const [searchTerm, setSearchTerm] = useState('');

  // 如果未认证，重定向到登录页面
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // 搜索文档
  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 新建文档
  const handleCreateDocument = () => {
    const newDoc = {
      id: `doc-${Date.now()}`,
      title: '新文档',
      lastEditedAt: new Date(),
      collaborators: 1,
      author: user?.username || 'unknown',
    };
    
    setDocuments([newDoc, ...documents]);
    router.push(`/documents/${newDoc.id}`);
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
            新建文档
          </button>
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-sm font-medium">{user?.username?.charAt(0) || 'U'}</span>
          </div>
        </div>
      </header>
      
      <main className="max-w-5xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">我的文档</h2>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="搜索文档..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              onClick={handleCreateDocument}
            >
              + 新建文档
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="grid grid-cols-4 gap-4 font-medium text-gray-500 text-sm">
              <div>文档名称</div>
              <div>最后编辑</div>
              <div>协作者</div>
              <div className="text-right">操作</div>
            </div>
          </div>
          
          <div className="divide-y divide-gray-100">
            {filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                className="p-4 grid grid-cols-4 gap-4 items-center hover:bg-gray-50 cursor-pointer"
                onClick={() => router.push(`/documents/${doc.id}`)}
              >
                <div className="font-medium text-gray-900">{doc.title}</div>
                <div className="text-sm text-gray-500">
                  {doc.lastEditedAt.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">
                  {doc.collaborators} 人
                </div>
                <div className="text-right">
                  <button
                    className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
                    onClick={(e) => {
                      e.stopPropagation();
                      // 这里可以添加更多操作，如下拉菜单
                      alert(`更多操作：${doc.id}`);
                    }}
                  >
                    ...
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {filteredDocuments.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              <p>未找到匹配的文档</p>
              <button
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={handleCreateDocument}
              >
                新建第一个文档
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DocumentsPage;