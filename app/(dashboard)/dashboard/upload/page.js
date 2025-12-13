"use client";
import { useState } from "react";

export default function UploadPage() {
  const [file, setFile] = useState(null);

  async function upload() {
    const form = new FormData();
    form.append("file", file);
    form.append("userId", "test-user-id"); // change after auth

    const res = await fetch("/api/files/upload", {
      method: "POST",
      body: form,
    });

    const data = await res.json();
    console.log(data);
    alert("Uploaded!");
  }

  return (
    <div className="p-8">
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={upload} className="bg-black text-white p-2">
        Upload
      </button>
    </div>
  );
}
