import React, { useEffect, useRef, useState, type ChangeEvent } from "react";
import { Button } from "primereact/button";
import { ProgressBar } from "primereact/progressbar";
import { Toast } from 'primereact/toast';

import AWS from "aws-sdk";
interface VideoUploaderProps {
    mediaPrefix: string;
    onUploadComplete: (fileUrl: string) => void;
    formSubmitted: boolean;
}

const VideoUploader: React.FC<VideoUploaderProps> = ({ mediaPrefix, onUploadComplete, formSubmitted }) => {
    const [file, setFile] = useState<File | null>(null);
    const [progress, setProgress] = useState<number>(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const allowedTypes = ['video/mp4', 'audio/avi'];
    const toastRef = useRef<Toast>(null);

    useEffect(() => {
        setFile(null);
        setProgress(0);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }, [formSubmitted]);

    // ===== DO Spaces credentials (DEV ONLY) =====
    const DO_ACCESS_KEY_ID = "DO00FENUV9H3CWEPGADJ";
    const DO_SECRET_ACCESS_KEY = "h1r0xZKa/a1zFWCAS/ElPSBf4Iu9D84nn1uSgGng/BQ";
    const DO_REGION = "nyc3";
    const DO_ENDPOINT = "https://nyc3.digitaloceanspaces.com";
    const DO_BUCKET = "wadex";

    AWS.config.update({
        accessKeyId: DO_ACCESS_KEY_ID,
        secretAccessKey: DO_SECRET_ACCESS_KEY,
        region: DO_REGION,
    });

    const s3 = new AWS.S3({
        endpoint: new AWS.Endpoint(DO_ENDPOINT),
        params: { Bucket: DO_BUCKET },
        signatureVersion: "v4",
    });

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const uploadFile = () => {
        if (!file) {
            alert("Please select a file first!");
            return;
        }

        let key = file.name;
        const prefix = mediaPrefix;
        key = `${prefix}${Date.now()}-${key}`;

        const params: AWS.S3.PutObjectRequest = {
            Key: key,
            Body: file,
            ACL: "public-read",
            ContentType: file.type,
            Bucket: DO_BUCKET
        };

        const MIN_PART_SIZE = 5 * 1024 * 1024; // 5 MiB

        const upload = s3.upload(
            params,
            {
                // ensure >= 5 MiB, and larger than the file to force single-part for tiny files
                partSize: Math.max(MIN_PART_SIZE, (file as any).size + 1024),
                queueSize: 1,
            }
        );

        upload.on("httpUploadProgress", (evt: any) => {
            const pct = Math.round((evt.loaded / evt.total) * 100);
            setProgress(pct);
        });

        upload.send((err: any) => {
            if (err) {
                toastRef.current?.show({
                    severity: 'error',
                    summary: 'Upload error',
                    detail: err.message || String(err),
                    life: 3000
                });
            } else {
                onUploadComplete(key);
                toastRef.current?.show({
                    severity: 'success',
                    summary: 'Upload success!',
                    life: 3000
                });
            }
        });
    };

    return (
        <div>
            <Toast ref={toastRef} />
            <input ref={fileInputRef} type="file" className="my-2 file-choose-btn" accept={allowedTypes.toString()} onChange={handleFileChange} />

            <div className="my-2">
                <Button
                    type="button"
                    label="Upload"
                    icon="pi pi-cloud-upload"
                    onClick={uploadFile}
                    disabled={!file}
                />
            </div>
            <ProgressBar value={progress} />
        </div>
    );
};

export default VideoUploader;
