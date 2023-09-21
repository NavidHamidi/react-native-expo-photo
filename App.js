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
import CarouselMenu from './src/components/CarouselMenu';

export default function App() {
  // define camera permission (consents asked to the user)
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasMicrophonePermission, setHasMicrophonePermission] = useState(null);

  // control the camera
  const [camera, setCamera] = useState(null);
  // image captured
  const [image, setImage] = useState(null);
  // set front or back camera
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);

  // camera mode
  // 0 : slow
  // 1 : portrait
  // 2 : photo
  // 3 : video
  const [cameraMode, setCameraMode] = useState(2); // default mode is photo

  // camera settings
  const [autoFocus, setAutoFocus] = useState(true);
  const [flashMode, setFlashMode] = useState(false);
  const [timerMode, setTimerMode] = useState(false); // TODO: Configure a sub menu 3, 5, 10 seconds, default value is 3s
  const [timer, setTimer] = useState(3);
  const [zoom, setZoom] = useState(0.0); // between 0.0 ad 1.0
  const [aspectRatio, setAspectRatio] = useState(true);

  // Hook to ask camera permission
  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');
      const microphoneStatus = await Camera.requestMicrophonePermissionsAsync();
      setHasMicrophonePermission(microphoneStatus.status === 'granted');
    })();
  }, []);

  // flip camera
  const flipCamera = () => {
    setCameraType(
      cameraType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  const getPictureSize = async () => {
    return await camera.getAvailablePictureSizesAsync(ratio)();
  };

  const sizes = getPictureSize();
  console.log(sizes);

  // take picture
  const takePicture = async () => {
    if (camera) {
      const data = await camera.getAvailablePictureSizesAsync('4:3');
      setImage(data.uri);
    }
  };

  if (hasCameraPermission === false) {
    return (
      <View>
        <Text>No access to camera</Text>
      </View>
    );
  }

  console.log('Current camera mode : ', cameraMode);

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <StatusBar style="light" />
      <View style={styles.container}>
        {/* Top menu container
          contains the following options:
          - flash mode
          - timer
          - ???? -> ATM it will modify the AutoFocus
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
                enabled={autoFocus}
                setEnabled={setAutoFocus}
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
            style={{ aspectRatio: aspectRatio ? 0.77 : 0.6 }}
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
          <View style={styles.menuCameraModeContainer}>
            <View style={styles.menuCameraModeContainer}>
              <View style={styles.menuItem}>
                <CarouselMenu
                  cameraMode={cameraMode}
                  setCameraMode={setCameraMode}
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
                  {image && (
                    <Image source={{ uri: image }} style={{ flex: 1 }} />
                  )}
                </View>
              </View>
              <View style={styles.menuCameraActions}>
                <View style={styles.menuItem}>
                  <TouchableOpacity onPress={takePicture}>
                    <MaterialCommunityIcons
                      name="circle-slice-8"
                      size={96}
                      color="white"
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
    borderColor: 'yellow',
    borderWidth: '2px',
  },
  cameraContainer: {
    flex: 4,
    borderColor: 'blue',
    borderWidth: '2px',
  },
  bottomMenuContainer: {
    flex: 1.5,
    borderColor: 'green',
    borderWidth: '2px',
  },
  topMenu: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItem: {
    flex: 1,
    borderColor: 'red',
    borderWidth: '2px',
    justifyContent: 'center',
    alignContent: 'center',
    textAlign: 'center',
    height: '100%',
  },

  fixedRatio: {
    aspectRatio: 0.77,
  },
  menuCameraModeContainer: {
    flex: 1,
    borderColor: 'pink',
    borderWidth: '1px',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuCameraMode: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuCameraActionContainer: {
    flex: 1,
    borderColor: 'purple',
    borderWidth: '1px',
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
