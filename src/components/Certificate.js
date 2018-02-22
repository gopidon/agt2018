import React, {Component} from 'react';
import {Modal} from 'antd';
import gql from 'graphql-tag';
import {graphql, compose} from 'react-apollo'
import {Button} from 'antd';

class Certificate extends Component{
    render(){
        const {file} = this.props;
        //console.log(file);
        return (
            <div style={{margin: '15px'}}>
                <a style={{marginRight: '15px'}} target="_blank" href={file.url}>{file.name}</a>
                <Button type="danger" shape="circle" icon="delete" size="small" onClick={this._deleteFile.bind(this, file.id)}></Button>
            </div>
        )
    }

    _deleteFile(fileId, e){
        e.preventDefault();
        var self = this;
        console.log("Deleting file:", fileId);
        Modal.confirm({
            title: 'Do you want to delete this uploaded certificate?',
            onOk() {
                self.props.deleteFile({variables: {id: fileId}})
                    .then((res) => {
                        console.log("Deleted File:", res.data);
                        self.props.onFileDelete()
                        //The file is auto-removed from the Notification object too.
                    })
                    .catch((err) => {
                        console.log("Error deleting file:", err);
                        self.props.onFileDelete()
                    })
            },
            onCancel() {},
        });
    }
}

const deleteFile = gql`
  mutation deleteFile($id: ID!) {
    deleteFile(id: $id) {
     id
    }
  }`;


export default
    graphql(deleteFile, {name: 'deleteFile'})(Certificate);