import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { MdDelete } from "react-icons/md";


const initialFileStructure = {
  root: {
    id: 'root',
    name: 'root',
    type: 'folder',
    children: [
      {
        id: uuidv4(),
        name: 'index.js',
        type: 'file',
        content: '// Welcome to index.js\nconsole.log("Hello, World!");',
      },
      {
        id: uuidv4(),
        name: 'src',
        type: 'folder',
        children: [
          {
            id: uuidv4(),
            name: 'App.jsx',
            type: 'file',
            content: 'import React from "react";\n\nfunction App() {\n  return <div>Hello from App!</div>;\n}\n\nexport default App;',
          },
        ],
      },
    ],
  },
};

function FileExplorer({ onFileSelect }) {
  const [fileStructure, setFileStructure] = useState(initialFileStructure);
  const [expandedFolders, setExpandedFolders] = useState(new Set(['root']));
  const [newItemName, setNewItemName] = useState('');
  const [isAddingFile, setIsAddingFile] = useState(false);
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [parentFolderId, setParentFolderId] = useState('root');

  // Toggle folder expansion
  const toggleFolder = (folderId) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  // Find a node in the file structure by ID
  const findNode = (node, id) => {
    if (node.id === id) return node;
    if (node.type === 'folder' && node.children) {
      for (const child of node.children) {
        const found = findNode(child, id);
        if (found) return found;
      }
    }
    return null;
  };

  // Add a new file or folder
  const addItem = (type) => {
    if (!newItemName) return;
    const newItem = {
      id: uuidv4(),
      name: newItemName,
      type,
      ...(type === 'file' ? { content: '// New file' } : { children: [] }),
    };

    setFileStructure((prev) => {
      const newStructure = JSON.parse(JSON.stringify(prev));
      const parentNode = findNode(newStructure.root, parentFolderId);
      if (parentNode && parentNode.type === 'folder') {
        parentNode.children.push(newItem);
      }
      return newStructure;
    });

    setNewItemName('');
    setIsAddingFile(false);
    setIsAddingFolder(false);
  };

  // Delete a file or folder
  const deleteItem = (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    setFileStructure((prev) => {
      const newStructure = JSON.parse(JSON.stringify(prev));
      const deleteFromNode = (node) => {
        if (node.type === 'folder' && node.children) {
          node.children = node.children.filter((child) => child.id !== id);
          node.children.forEach(deleteFromNode);
        }
      };
      deleteFromNode(newStructure.root);
      return newStructure;
    });
  };

  // Render file tree recursively
  const renderTree = (node, depth = 0) => {
    if (!node) return null;

    const isFolder = node.type === 'folder';
    const isExpanded = expandedFolders.has(node.id);

    return (
      <div key={node.id} style={{ paddingLeft: `${depth * 1.5}rem` }}>
        <div className="flex items-center gap-2 py-1 hover:bg-gray-700 rounded">
          {isFolder ? (
            <button
              onClick={() => toggleFolder(node.id)}
              className="text-gray-400 hover:text-white"
              aria-label={isExpanded ? `Collapse ${node.name}` : `Expand ${node.name}`}
            >
              {isExpanded ? '▼' : '▶'}
            </button>
          ) : (
            <span className="w-4" />
          )}
          <span
            className={`flex-1 cursor-pointer ${isFolder ? 'text-blue-400' : 'text-gray-200'}`}
            onClick={() => {
              if (!isFolder) onFileSelect(node.content, node.id, node.name);
            }}
          >
            {node.name}
          </span>
          <button
            onClick={() => deleteItem(node.id)}
            className="text-red-400 hover:text-red-600 mr-2"
            aria-label={`Delete ${node.name}`}
          >
            <MdDelete/>
          </button>
        </div>
        {isFolder && isExpanded && node.children && (
          <div>
            {node.children.map((child) => renderTree(child, depth + 1))}
            {(isAddingFile || isAddingFolder) && parentFolderId === node.id && (
              <div className="flex items-center gap-2 pl-6 py-1">
                <input
                  type="text"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder={isAddingFile ? 'New file name' : 'New folder name'}
                  className="bg-gray-800 text-white p-1 rounded w-32"
                  autoFocus
                />
                <button
                  onClick={() => addItem(isAddingFile ? 'file' : 'folder')}
                  className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setIsAddingFile(false);
                    setIsAddingFolder(false);
                    setNewItemName('');
                  }}
                  className="bg-gray-600 text-white px-2 py-1 rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-64 bg-gray-800 h-full p-4 overflow-y-auto">
      <div className="flex justify-between mb-4">
        <button
          onClick={() => {
            setIsAddingFile(true);
            setParentFolderId('root');
          }}
          className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
          aria-label="Add new file"
        >
          + File
        </button>
        <button
          onClick={() => {
            setIsAddingFolder(true);
            setParentFolderId('root');
          }}
          className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
          aria-label="Add new folder"
        >
          + Folder
        </button>
      </div>
      {renderTree(fileStructure.root)}
    </div>
  );
}

export default FileExplorer;