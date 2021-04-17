import { useState } from 'react';
import axios from 'axios';
import useRequest from '../../hooks/use-request';

import Router from 'next/router';

const NewTicket = () => {
  const [selectedImage, setSelectedImage] = useState();
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');

  const { doRequest, errors } = useRequest({
    url: '/api/tickets',
    method: 'post',
    body: {
      title,
      price,
      imageUrl,
      description,
    },

    onSuccess: () => Router.push('/'),
  });

  const onSubmit = (event) => {
    event.preventDefault();

    doRequest();
  };

  const onBlur = () => {
    const value = parseFloat(price);

    if (isNaN(value)) {
      return;
    }

    setPrice(value.toFixed(2));
  };

  const handleImageUpload = async (event) => {
    event.preventDefault();
    if (!selectedImage) {
      return;
    }
    const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/image/upload`;
    const formData = new FormData();
    formData.append('file', selectedImage);
    formData.append(
      'upload_preset',
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
    );
    // const config = {
    //   headers: { 'content-type': 'multipart/form-data' },
    //   onUploadProgress: (event) => {
    //     console.log(
    //       `Current progress:`,
    //       Math.round((event.loaded * 100) / event.total)
    //     );
    //   },
    // };
    try {
      // const { data } = await axios.post(
      //   '/api/image-upload',
      //   //'http://www.ticketzone-app-prod.club/api/image-upload',
      //   //'https://ticketzone.dev/api/image-upload',
      //   //'http://localhost:3000/api/image-upload',
      //   formData,
      //   config
      // );
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setImageUrl(data.secure_url);
      setImages([...images, data]);
    } catch (error) {
      console.log('Something went wrong!');
    }
  };

  const handleChange = (event) => {
    setSelectedImage(event.target.files[0]);
  };

  return (
    <>
      <h4> Create Ticket</h4>
      <form onSubmit={onSubmit}>
        <div className="row ">
          <div className="col-sm-6 mb-2">
            <div className="form-group">
              <label>Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Price</label>
              <input
                value={price}
                onBlur={onBlur}
                onChange={(e) => setPrice(e.target.value)}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                row="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="form-control"
              ></textarea>
            </div>
          </div>
          <div className="col-sm-6 mb-2 ">
            <div className="card ">
              <div
                style={{
                  position: 'relative',
                  height: 0,
                  paddingTop: `${(225 / 350) * 100}%`,
                  backgroundImage: `url(/image_sample.png)`,
                  backgroundPosition: 'center center',
                  backgroundSize: `100%`,
                }}
              >
                {images.map((image) => (
                  <div
                    key={image.public_id}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                    }}
                  >
                    <img src={image.secure_url} width="100%" height="350" />
                  </div>
                ))}
              </div>
            </div>
            <div className="form-group">
              <input
                onChange={handleChange}
                accept=".jpg, .png, .jpeg"
                className="fileInput mb-2"
                type="file"
                className="form-control-file border border-1"
              />
            </div>
            <div>
              <button
                onClick={handleImageUpload}
                disabled={!selectedImage}
                className="btn btn-primary mb-2"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
        <div>
          {errors}

          <button className="w-100 btn btn-primary btn-lg mb-2">Submit</button>
        </div>
      </form>
    </>
  );
};

export default NewTicket;
