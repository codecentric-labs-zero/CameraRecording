/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Dimensions
} from 'react-native';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import Camera from 'react-native-camera'
import RNFetchBlob from 'react-native-fetch-blob'
import base64 from 'base-64'

export default class CameraRecording extends Component {
  constructor(props) {
    super(props)
    this.state = {capture: false}
    this.uploadImage = this.uploadImage.bind(this)
    this.takePicture = this.takePicture.bind(this)
  }

  render() {
    var buttonText= this.state.capture ? 'Stop' : 'Capture'
    return (
        <View style={styles.container}>
          <Camera
              ref={(cam) => {
                this.camera = cam;
              }}
              style={styles.preview}
              aspect={Camera.constants.Aspect.fill}
              captureMode={Camera.constants.CaptureMode.video}>
            <Text style={styles.capture} onPress={
              this.takePicture.bind(this)
            }>{buttonText}</Text>
            <Text style={styles.capture} onPress={
            this.uploadImage.bind(this)
            }>Upload</Text>

          </Camera>
        </View>
    );
  }

  takePicture() {
    if(!this.state.capture) {
      this.setState({capture:true})
      this.camera.capture()
          .then((data) => this.setState({videoPath: data.path}))
          .catch(err => console.error(err));
    }else{
      this.setState({capture:false})

      this.camera.stopCapture()

    }
  }

    uploadImage(){
      let upload_url = 'https://api.cloudinary.com/v1_1/dyljdrxl8/video/upload?upload_preset=vsywjn6f'
      RNFetchBlob.fetch('POST', upload_url, {
        'Content-Type': 'multipart/form-data'
      }, [
        { name: 'file', filename: 'video.mp4', type: 'video/mp4', data: RNFetchBlob.wrap(this.state.videoPath) }
      ]).then((response) => {
        console.log(response)
      }).catch((error) => {
        console.log(error.message)
      })

    }

}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40
  }
});


AppRegistry.registerComponent('CameraRecording', () => CameraRecording);
