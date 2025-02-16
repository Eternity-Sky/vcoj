import React from 'react'
import Editor from '@monaco-editor/react'

interface MonacoEditorProps {
  language: string;
  value: string;
  onChange: (value: string) => void;
}

export default function MonacoEditor({ language, value, onChange }: MonacoEditorProps) {
  return (
    <Editor
      height="100%"
      defaultLanguage={language}
      value={value}
      onChange={(value) => onChange(value || '')}
      theme="vs-dark"
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: 'on',
        scrollBeyondLastLine: false,
        automaticLayout: true,
      }}
    />
  )
} 