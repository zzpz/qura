import * as React from 'react';

export default function UploadForm(props){
    const [formState, setFormState] = React.useState(props);


    return(
    <div className="UploadForm">
    <form action="/upload/file" enctype="multipart/form-data" method="post">
      <div>Description: <input type="text" name="description" /></div>
      <div>File: <input type="file" name="file" /></div>
      <input type="submit" value="Upload" />
    </form>
    </div>
    );
}