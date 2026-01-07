"use client";

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { createEditor } from 'slate';
import { Slate, Editable, withReact, RenderElementProps, RenderLeafProps } from 'slate-react';
import { withHistory } from 'slate-history';
import { useSocket } from '@/context/SocketContext';

interface EditorProps {
  documentId?: string;
  initialContent?: any;
}

const Editor = ({ documentId = 'default-doc', initialContent }: EditorProps) => {
  const { socket, joinDocument, leaveDocument, sendDocumentChange } = useSocket();
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const [value, setValue] = useState(initialContent || [
    {
      type: 'paragraph',
      children: [{ text: '开始编辑你的文档...' }],
    },
  ]);

  // 模拟用户ID
  const userId = useMemo(() => `user-${Math.random().toString(36).substr(2, 9)}`, []);

  // 加入文档房间
  useEffect(() => {
    joinDocument(documentId);
    
    // 监听文档变更
    if (socket) {
      const handleDocumentChange = (data: any) => {
        if (data.userId !== userId) {
          // 应用其他用户的变更
          setValue(data.changes);
        }
      };
      
      socket.on('document-change', handleDocumentChange);
      
      return () => {
        socket.off('document-change', handleDocumentChange);
      };
    }
    
    return () => {
      leaveDocument(documentId);
    };
  }, [documentId, joinDocument, leaveDocument, socket, userId]);

  // 处理文档变更
  const handleChange = useCallback((newValue: any) => {
    setValue(newValue);
    // 发送变更给其他用户
    sendDocumentChange(documentId, newValue, userId);
  }, [documentId, sendDocumentChange, userId]);

  const renderElement = useCallback((props: RenderElementProps) => {
    switch (props.element.type) {
      case 'heading-one':
        return <h1 {...props.attributes}>{props.children}</h1>;
      case 'heading-two':
        return <h2 {...props.attributes}>{props.children}</h2>;
      case 'heading-three':
        return <h3 {...props.attributes}>{props.children}</h3>;
      case 'paragraph':
        return <p {...props.attributes}>{props.children}</p>;
      case 'block-quote':
        return <blockquote {...props.attributes}>{props.children}</blockquote>;
      case 'bulleted-list':
        return <ul {...props.attributes}>{props.children}</ul>;
      case 'numbered-list':
        return <ol {...props.attributes}>{props.children}</ol>;
      case 'list-item':
        return <li {...props.attributes}>{props.children}</li>;
      default:
        return <p {...props.attributes}>{props.children}</p>;
    }
  }, []);

  const renderLeaf = useCallback((props: RenderLeafProps) => {
    const leaf = props.leaf;
    const attributes = props.attributes;
    let children = props.children;

    if (leaf.bold) {
      children = <strong>{children}</strong>;
    }

    if (leaf.italic) {
      children = <em>{children}</em>;
    }

    if (leaf.underline) {
      children = <u>{children}</u>;
    }

    if (leaf.code) {
      children = <code>{children}</code>;
    }

    return <span {...attributes}>{children}</span>;
  }, []);

  return (
    <div className="w-full h-full bg-white p-8">
      <Slate editor={editor} initialValue={value} onChange={handleChange}>
        <div className="mb-4 flex gap-2 items-center">
          <div className="flex gap-2">
            <button
              className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200"
              onMouseDown={(e) => {
                e.preventDefault();
                editor.toggleMark('bold');
              }}
            >
              B
            </button>
            <button
              className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200"
              onMouseDown={(e) => {
                e.preventDefault();
                editor.toggleMark('italic');
              }}
            >
              I
            </button>
            <button
              className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200"
              onMouseDown={(e) => {
                e.preventDefault();
                editor.toggleMark('underline');
              }}
            >
              U
            </button>
            <button
              className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200"
              onMouseDown={(e) => {
                e.preventDefault();
                editor.toggleMark('code');
              }}
            >
              Code
            </button>
          </div>
          <div className="w-px h-6 bg-gray-300 mx-2"></div>
          <select
            className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200"
            onMouseDown={(e) => e.preventDefault()}
            onChange={(e) => {
              const format = e.target.value;
              const isActive = editor.selection && format !== 'paragraph';
              const isList = ['bulleted-list', 'numbered-list'].includes(format);
              
              if (isActive) {
                editor.setNodes({ type: 'paragraph' });
              } else if (isList) {
                editor.setNodes({ type: 'list-item' });
                editor.wrapNodes({ type: format });
              } else {
                editor.setNodes({ type: format });
              }
            }}
          >
            <option value="paragraph">Paragraph</option>
            <option value="heading-one">H1</option>
            <option value="heading-two">H2</option>
            <option value="heading-three">H3</option>
            <option value="block-quote">Quote</option>
            <option value="bulleted-list">Bullet List</option>
            <option value="numbered-list">Number List</option>
          </select>
          <div className="ml-auto text-sm text-gray-500">
            实时协作已连接
          </div>
        </div>
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          className="border border-gray-300 rounded p-4 min-h-[400px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="开始输入..."
        />
      </Slate>
    </div>
  );
};

export default Editor;