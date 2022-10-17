import { useEffect, useState } from "react";
import axios from "axios";
import { TextField } from "@mui/material";


const UploadForm = (props) => {

  const tfPlaceHolder = "Describe the item - it will take a moment to upload to Mumbai"
  const defaultValues = {
    file: "",
    description: "",
    title: ""
  }

  const [formValues, setFormValues] = useState(defaultValues); //should be empty initially
  const [loading, setLoading] = useState(false);
  const [filepreviewSrc, setfilepreviewSrc] = useState("");

  useEffect(() => {
    setfilepreviewSrc("");

  }, [loading])

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });

    if (name === "file") {
      setfilepreviewSrc(URL.createObjectURL(e.target.files[0]))
    }
  };

  const onSubmit = (event) => {
    event.preventDefault();
    let bodyFormData = new FormData(document.querySelector("form"));
    // for (const name in formValues) {
    //   bodyFormData.append(name, formValues[name]);
    // }


    setLoading(true);
    axios.post('/upload/file', bodyFormData, {
      headers: {
        "Content-Type": "multipart/form-data",
      }
    }).then(result => {
      // Handle result…
      console.log(result.data);
      alert("success!");
      setLoading(false);
      setFormValues(defaultValues);
    }).catch((err) => {
      console.log(err);
    });

  }


  return (
    <form onSubmit={onSubmit}>
      <TextField label={"Title"} InputLabelProps={{ shrink: true }} name="title" type="text" onChange={handleInputChange} value={formValues.title} placeholder={formValues.file.split('\\').slice(-1)[0]}></TextField>
      <br></br>

      <TextField InputLabelProps={{ shrink: true }} multiline minRows={10} name="description" type="text" onChange={handleInputChange} value={formValues.description} placeholder={tfPlaceHolder}></TextField>
      <br></br>
      <input type="file" name="file" onChange={handleInputChange} value={formValues.file} />
      {/* <form action="/upload/file" encType="multipart/form-data" method="post"> */}
      <br></br>
      <>
        {!loading && <button type="submit">Upload</button>}
        <br></br>
        {filepreviewSrc && <img width={100} height={100} src={filepreviewSrc}></img>}
      </>
    </form >
  );

}

export default UploadForm;
