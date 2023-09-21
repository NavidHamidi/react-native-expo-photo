// Carousel.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Carousel from 'react-native-snap-carousel';

// Dimension configuration
const horizontalMargin = 20;
const sliderWidth = Dimensions.get('window').width;
const sliderHeight = 30;

const slideWidth = 50;
const itemWidth = slideWidth + horizontalMargin * 2;
const itemHeight = 20;

const data = [
  {
    id: 1,
    title: 'Slow',
  },
  {
    id: 2,
    title: 'Portrait',
  },
  {
    id: 3,
    title: 'Photo',
  },
  {
    id: 4,
    title: 'Video',
  },
];

function CarouselMenu(props) {
  // Track the index of the selected item to customize style
  let cameraMode = props.cameraMode;

  const renderItem = ({ item, index }) => {
    return (
      <View style={index === cameraMode ? styles.slideSelected : styles.slide}>
        <View style={styles.slideInnerContainer}>
          <Text style={styles.text}>{item.title}</Text>
        </View>
      </View>
    );
  };

  return (
    <Carousel
      ref={(c) => {
        this._carousel = c;
      }}
      loop={false}
      layout={'default'}
      itemWidth={itemWidth}
      itemHeight={itemHeight}
      sliderWidth={sliderWidth}
      sliderHeight={sliderHeight}
      autoPlay={false}
      data={data}
      onSnapToItem={(index) => {
        props.setCameraMode(index);
        cameraMode = index;
      }}
      renderItem={renderItem}
      firstItem={2}
      containerCustomStyle={{ flexGrow: 0 }}
    />
  );
}

const styles = StyleSheet.create({
  slideSelected: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '24px',
    padding: 20,
    width: itemWidth,
    height: itemHeight,
    backgroundColor: '#65b9ed',
  },
  slide: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '24px',
    padding: 20,
    width: itemWidth,
    height: itemHeight,
  },
  slideInnerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: slideWidth,
    height: 30,
  },
  text: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 14,
  },
});

export default CarouselMenu;
