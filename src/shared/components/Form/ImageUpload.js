import React, { useState, useRef, useEffect } from 'react';

import './ImageUpload.css'

const ImageUpload = (props) => {
    const [file, setFile] = useState();
    const filePickerRef = useRef();
    const [previewUrl, setPreviewUrl] = useState();

    useEffect(() => {
        if (!file) {
            return
        }
        const fileReader = new FileReader();
        fileReader.onload = () => {
            setPreviewUrl(fileReader.result);
        };
        fileReader.readAsDataURL(file);
    }, [file])

    const pickedHandler = (event) => {
        let pickedFile;
        if (event.target.files && event.target.files.length === 1) {
            pickedFile = event.target.files[0];
            setFile(pickedFile);
        }
        props.onInput(props.id, pickedFile, true);
    }

    const pickImageHandler = () => {
        filePickerRef.current.click();
    }

    return (
        <div>
            <input
                id={props.id}
                ref={filePickerRef}
                style={{ display: 'none' }}
                type="file"
                accept=".jpg,.png,.jpeg"
                onChange={pickedHandler}
            />
            <div className='image-upload'>
                <div className="image-upload__preview">
                    {previewUrl && <img src={previewUrl} alt="Preview" />}
                </div>
                <button type="button" onClick={pickImageHandler}>Dodaj zdjęcie</button>
            </div>

        </div>
    );
}

export default ImageUpload;