import React, { useState } from 'react'
import { Button } from 'reactstrap'
import { LoadingInline, BlackWhiteImg } from '../common'
import { injectIntl, FormattedMessage } from 'react-intl'
import { FaFileImport, FaUpload, FaTrash, FaTimes } from 'react-icons/fa'
import ImageUploading from 'react-images-uploading'
import AWS from 'aws-sdk'
import variables from '../../variables'
import { useAlert } from '../../hooks'

const MAX_NUMBER = 1
const S3_BUCKET = variables.bucketS3Name
const S3_REGION = variables.bucketS3Region

AWS.config.update({
  accessKeyId: variables.cognitoAccessKey,
  secretAccessKey: variables.cognitoSecretKey
})

const myBucket = new AWS.S3({
  params: { Bucket: S3_BUCKET },
  region: S3_REGION
})

const buttonStyles = { fontSize: 1.2 + 'rem' }

const ImageUploader = (props) => {
  // Props and params
  const { id, disabled, onUploadSuccess, oldImage, onCancelClick, intl } = props
  const { formatMessage } = intl

  // Hooks
  const { alertSuccess, alertError } = useAlert()

  // State
  const [images, setImages] = React.useState([])
  const [uploading, setUploading] = useState(false)

  // Button handlers
  const onChange = (imageList, addUpdateIndex) => {
    // data for submit
    // console.log(imageList, addUpdateIndex)
    setImages(imageList)
  }

  const onUploadClick = () => {
    const fileToUpload = images[0]
    const { file } = fileToUpload
    const fileName =
      id +
      '_' +
      file.name
        .replace(' ', '_')
        .replace('-', '_')
        .replace(/[^a-zA-Z0-9-_.]/g, '')

    const params = {
      ACL: 'public-read',
      Body: file,
      Bucket: S3_BUCKET,
      Key: fileName
    }

    setUploading(true)
    const putObjectPromise = myBucket.putObject(params).promise()
    const fileUrl = `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/${fileName}`
    console.log(fileUrl)
    putObjectPromise
      .then((data) => {
        if (oldImage) {
          try {
            const urlParts = oldImage.split('/')
            const oldFileName = urlParts[urlParts.length - 1]
            const deleteObjectPromise = myBucket.deleteObject({ Bucket: S3_BUCKET, Key: oldFileName }).promise()
            deleteObjectPromise
              .then(() => {
                console.log('deleteObject - success')
              })
          } catch {
            alertError(formatMessage({ id: 'common_error.couldnt_upload_image' }))
          } finally {
            alertSuccess(formatMessage({ id: 'image_uploaded' }))
            onUploadSuccess(fileUrl)
            setUploading(false)
          }
        } else {
          alertSuccess(formatMessage({ id: 'image_uploaded' }))
          onUploadSuccess(fileUrl)
          setUploading(false)
        }
      })
      .catch((err) => {
        console.log(err)
        alertError(formatMessage({ id: 'common_error.couldnt_upload_image' }))
      })
  }

  return (
    <div className='image-uploader'>
      <ImageUploading
        multiple={false}
        value={images}
        onChange={onChange}
        maxNumber={MAX_NUMBER}
        dataURLKey='data_url'
      >
        {({
          imageList,
          onImageUpload,
          onImageRemoveAll,
          // onImageUpdate,
          // onImageRemove,
          // isDragging,
          dragProps
        }) => (
          <div className='upload-image-wrapper'>
            <div className='row text-center ml-1 mr-1'>
              <div className='col-md-10 col-xs-12 pl-0 pr-0 border rounded'>
                {imageList.length === 0 && (
                  <div className='d-flex justify-content-center align-items-center bg-light text-muted h-100'>
                    <FormattedMessage id='select_image' />
                  </div>
                )}
                {imageList.map((image, index) => (
                  <div key={index} className='image-item h-100 d-flex justify-content-center align-items-center'>
                    <BlackWhiteImg url={image.data_url} />
                    {/*
                  <div className='image-item__btn-wrapper'>
                    <button onClick={() => onImageUpdate(index)}>Update</button>
                    <button onClick={() => onImageRemove(index)}>Remove</button>
                  </div>
                  */}
                  </div>
                ))}
              </div>
              <div className='col-md-2 col-xs-12'>
                <div className='row d-flex justify-content-between'>
                  <div className='col-md-12 col-sm-3'>
                    <Button
                      color='outline-secondary'
                      className='m-1'
                      disabled={imageList.length !== 0 || disabled || uploading}
                      onClick={onImageUpload}
                      {...dragProps}
                    >
                      <FaFileImport />
                    </Button>
                  </div>
                  <div className='col-md-12 col-sm-3'>
                    <Button
                      color='outline-danger'
                      className='m-1'
                      style={buttonStyles}
                      disabled={imageList.length === 0 || disabled || uploading}
                      onClick={onImageRemoveAll}
                    >
                      <FaTrash />
                    </Button>
                  </div>
                  <div className='col-md-12 col-sm-3'>
                    <Button
                      color='outline-success'
                      className='m-1'
                      style={buttonStyles}
                      disabled={imageList.length === 0 || disabled || uploading}
                      onClick={onUploadClick}
                    >
                      <FaUpload />
                      {uploading && <LoadingInline color='success' className='ml-3' />}
                    </Button>
                  </div>
                  <div className='col-md-12 col-sm-3'>
                    <Button
                      color='outline-dark'
                      className='m-1'
                      style={buttonStyles}
                      disabled={disabled || uploading}
                      onClick={onCancelClick}
                    >
                      <FaTimes />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </ImageUploading>
    </div>
  )
}

export default injectIntl(ImageUploader)
