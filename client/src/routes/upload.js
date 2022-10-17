import { useEffect } from "react";
import UploadForm from "../components/UploadForm";

export default function Upload() {

  useEffect(() => {
    document.title = "QUR Association Inc"
  })

  return (
    <div id="upload">
      <h2> Upload a single item via a web form</h2>
      <UploadForm></UploadForm>
    </div>
  );
}