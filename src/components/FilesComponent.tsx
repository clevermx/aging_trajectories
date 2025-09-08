

import React from 'react';
import {List} from "semantic-ui-react";
import {format} from 'timeago.js';
import {filesize} from 'filesize';
import _ from 'lodash';
import {connect} from 'react-redux';
import { SemanticICONS } from 'semantic-ui-react';
import "semantic-ui-css/semantic.min.css";
interface FileInfo {
  name: string;
  path: string;
  size: number;
  mtime: number;
  link: string;
  description?: string;
}
export interface FileTabData {
  name: string;
  display_name:string;
  color?: string;
  files: FileInfo[];
}

const fileTypes: Record<string, string[]> = {
  'file excel outline': ['.xls', '.xlsx', '.xlsm', '.tsv', '.csv'],
  'file pdf outline': ['.pdf'],
  'file word outline': ['.doc', '.docx', '.word'],
  'file archive outline': ['.Rda', '.Robj', '.rda', '.robj', '.h5ad'],
  'file powerpoint outline': ['.pptx', '.ppt', '.pptm'],
  'file code outline': ['.R', '.cpp', '.java'],
  'file image outline': ['.png', '.jpg', '.svg']
};

const fileTypeMapper = (filename: string): SemanticICONS => {
  for (const key in fileTypes) {
    if (fileTypes[key].some(ext => _.endsWith(filename.toLowerCase(), ext.toLowerCase()))) {
      return key as SemanticICONS;
    }
  }
  return 'linkify' as SemanticICONS;
};


interface FilesComponentProps {
  data: FileTabData;
  filesLoaded: boolean;
}




export const FilesComponent: React.FC<FilesComponentProps> = ({ data, filesLoaded }) => {

  console.log(data)


  return(
<List divided relaxed>
  {!data.files && <div>Loading files...</div>}
  {data.files &&
    data.files.map(file => (
      <List.Item key={file.path} style={{ display: "flex", alignItems: "center" }}>
        <List.Icon
          className='outline-none'
          name={fileTypeMapper(file.name) as any}
          size="large"
          verticalAlign="middle"
        />
        <List.Content>
            <a download href={file.path} className="font-medium text-blue-600 hover:underline">
              {file.name}
            </a>
             <div className="text-sm text-gray-500">
              {file.description? file.description : format(file.mtime)+ ", " + filesize(file.size)}
            </div>
        </List.Content>
      </List.Item>
    ))}
</List>
);
} 