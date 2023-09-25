import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import { AutoFocus, Camera, FlashMode, VideoStabilization } from 'expo-camera';
import { StatusBar } from 'expo-status-bar';
import CameraOption from './src/components/CameraOption';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import * as MediaLibrary from 'expo-media-library';
import CarouselMenu from './src/components/CarouselMenu';

export default function App() {
  // define camera permission (consents asked to the user)
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasMicrophonePermission, setHasMicrophonePermission] = useState(null);

  // define Media permissions (save into gallery)
  const [mediaPermission, setMediaPermission] = useState(null);

  // control the camera
  const [camera, setCamera] = useState(null);

  // set front or back camera
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);

  // image captured
  const [image, setImage] = useState(null);

  // Availables pictures sizes of the captured photo depending of the ratio : 4:3, 16:9
  const [availablePictureSizes, setAvailablePictureSizes] = useState(null);

  // camera mode
  // 0 : slow
  // 1 : portrait
  // 2 : photo
  // 3 : video
  const cameraMode = {
    Slow: 0,
    Portrait: 1,
    Photo: 2,
    Video: 3,
  };
  const [currentCameraMode, setCurrentCameraMode] = useState(cameraMode.Photo); // default mode is photo

  // camera settings
  const [mirrorMode, setMirrorMode] = useState(false);
  const [autoFocus, setAutoFocus] = useState(true);
  const [flashMode, setFlashMode] = useState(false);
  const [timerMode, setTimerMode] = useState(false); // TODO: Configure a sub menu 3, 5, 10 seconds, default value is 3s
  const [timer, setTimer] = useState(3);
  const [zoom, setZoom] = useState(0.0); // between 0.0 ad 1.0
  const [aspectRatio, setAspectRatio] = useState(true);

  // Record video
  //const [cameraRecordQuality, setCameraRecordQuality = useState(VideoQuality['1080p'])]
  const [isRecording, setIsRecording] = useState(false);
  // Uri of the recorded video
  const [recordUri, setRecordUri] = useState(null);

  // Hook to ask camera permission
  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');

      const microphoneStatus = await Camera.requestMicrophonePermissionsAsync();
      setHasMicrophonePermission(microphoneStatus.status === 'granted');

      const mediaStatus = await MediaLibrary.requestPermissionsAsync();
      setMediaPermission(mediaStatus.status === 'granted');
    })();
  }, []);

  // If no permission set we cannot use the camera
  if (hasCameraPermission === false) {
    return (
      <View>
        <Text>No access to camera</Text>
      </View>
    );
  }

  // flip camera
  const flipCamera = () => {
    setCameraType(
      cameraType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  // Save captured picture or video
  // ATM it cause crash but didn't find out why because the picture or video is well saved, no error printed on the console
  const savePictureOrRecordToLibrary = async (uri) => {
    /*try {
      const asset = await MediaLibrary.createAssetAsync(uri);
      if (asset) await MediaLibrary.saveToLibraryAsync(asset);
    } catch (error) {
      console.error('error when saving : ', error);
    }*/
  };

  // take picture
  const takePicture = async () => {
    const options = {};

    if (camera) {
      const { uri } = await camera.takePictureAsync(options);
      setImage(uri);
      try {
        savePictureOrRecordToLibrary(uri);
      } catch (error) {
        console.log('error when saving : ', error);
      }
    }
  };

  // record video
  const startRecord = async () => {
    const options = {};
    if (!isRecording && camera) {
      setIsRecording(true);
      const { uri } = await camera.recordAsync(options);
      setRecordUri(uri);
      try {
        savePictureOrRecordToLibrary(uri);
      } catch (error) {
        console.log('error when saving : ', error);
      }
    }
  };

  // stop video record
  const stopRecord = () => {
    if (camera && isRecording) {
      camera.stopRecording();
      setIsRecording(false);
    }
  };

  // Dispatch capture button
  const dispatchCaptureButton = () => {
    if (currentCameraMode == cameraMode.Photo) takePicture();
    else if (currentCameraMode == cameraMode.Video) {
      if (isRecording) stopRecord();
      else startRecord();
    }
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <StatusBar style="light" />
      <View style={styles.container}>
        {/* Top menu container
          contains the following options:
          - flash mode
          - timer
          - ???? -> ATM it will modify the mirror mode
          - aspect ratio
          - settings
         */}
        <View style={styles.topMenuContainer}>
          <View style={styles.topMenu}>
            <View style={styles.menuItem}>
              <CameraOption
                iconName="offline-bolt"
                enabled={flashMode}
                setEnabled={setFlashMode}
              />
            </View>
            <View style={styles.menuItem}>
              <CameraOption
                iconName="av-timer"
                enabled={timerMode}
                setEnabled={setTimerMode}
              />
            </View>
            <View style={styles.menuItem}>
              <CameraOption
                iconName="camera-alt"
                enabled={mirrorMode}
                setEnabled={setMirrorMode}
              />
            </View>
            <View style={styles.menuItem}>
              <CameraOption
                iconName="aspect-ratio"
                enabled={aspectRatio}
                setEnabled={setAspectRatio}
              />
            </View>
            <View style={styles.menuItem}>
              <CameraOption
                iconName="settings"
                enabled={flashMode === flashMode.on}
                setEnabled={setFlashMode}
              />
            </View>
          </View>
        </View>

        {/* Camera container */}
        <View style={styles.cameraContainer}>
          <Camera
            ref={(ref) => setCamera(ref)}
            //style={styles.fixedRatio}
            style={{ aspectRatio: aspectRatio ? 0.77 : 0.56 }}
            type={cameraType}
            ratio={aspectRatio ? '4:3' : '16:9'}
            zoom={zoom}
            autoFocus={autoFocus ? AutoFocus.on : AutoFocus.off}
            flashMode={flashMode ? FlashMode.on : FlashMode.off}
            videoStabilizationMode={VideoStabilization.auto}
          />
        </View>

        {/* 1st Bottom menu 
         contains the following options:
         - Carousel menu for camera mode : slow, portrait, photo, video
        */}
        <View style={styles.bottomMenuContainer}>
          <View style={styles.menuCurrentCameraModeContainer}>
            <View style={styles.menuCurrentCameraModeContainer}>
              <View style={styles.menuItem}>
                <CarouselMenu
                  currentCameraMode={currentCameraMode}
                  setCurrentCameraMode={setCurrentCameraMode}
                />
              </View>
            </View>
          </View>

          {/* 2nd Bottom menu 
         contains the following options:
         - Last picture
         - Take picture
         - Flip camera 
        */}
          <View style={styles.menuCameraActionContainer}>
            <View style={styles.menuCameraActions}>
              <View style={styles.menuCameraActions}>
                <View style={styles.menuItem}>
                  {cameraMode === cameraMode.Video ? (
                    <Video source={{ uri: recordUri }} style={{ flex: 1 }} />
                  ) : (
                    <Image source={{ uri: image }} style={{ flex: 1 }} />
                  )}
                </View>
              </View>
              <View style={styles.menuCameraActions}>
                <View style={styles.menuItem}>
                  <TouchableOpacity onPress={dispatchCaptureButton}>
                    <MaterialCommunityIcons
                      name="circle-slice-8"
                      size={96}
                      color={isRecording ? 'red' : 'white'}
                      style={styles.icon}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.menuItem}>
                <TouchableOpacity onPress={flipCamera}>
                  <MaterialIcons
                    name="flip-camera-android"
                    size={48}
                    color="white"
                    style={styles.icon}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeAreaView: {
    backgroundColor: '#000',
    flex: 1,
  },
  container: {
    flex: 1,
  },
  topMenuContainer: {
    flex: 0.5,
    /*borderColor: 'yellow',
    borderWidth: '2px',*/
  },
  cameraContainer: {
    flex: 4,
    /*borderColor: 'blue',
    borderWidth: '2px',*/
  },
  bottomMenuContainer: {
    flex: 1.5,
    /*borderColor: 'green',
    borderWidth: '2px',*/
  },
  topMenu: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItem: {
    flex: 1,
    /*borderColor: 'red',
    borderWidth: '2px',*/
    justifyContent: 'center',
    alignContent: 'center',
    textAlign: 'center',
    height: '100%',
  },

  fixedRatio: {
    aspectRatio: 0.77,
  },
  menuCurrentCameraModeContainer: {
    flex: 1,
    /*borderColor: 'pink',
    borderWidth: '1px',*/
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuCurrentCameraMode: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuCameraActionContainer: {
    flex: 1,
    /*borderColor: 'purple',
    borderWidth: '1px',*/
  },
  menuCameraActions: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  icon: {
    justifyContent: 'center',
    alignContent: 'center',
    textAlign: 'center',
  },
});
