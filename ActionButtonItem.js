import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Animated,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

const alignItemsMap = {
  center: 'center',
  left: 'flex-start',
  right: 'flex-end',
};

let actionBtnWidth = 0;

export default class ActionButtonItem extends Component {

  constructor(props) {
    super(props);
    this.state = {
      spaceBetween: 15,
      alignItems: alignItemsMap[this.props.position],
    };

    if (!props.children || Array.isArray(props.children)) {
      throw new Error("ActionButtonItem must have a Child component.");
    }

    if (props.size > 0) {
      actionBtnWidth = this.props.size;
    }
  }

  render() {
    const offsetX = this.props.radius * Math.cos(this.props.angle);
    const offsetY = this.props.radius * Math.sin(this.props.angle);
    return (
      <Animated.View
        style={[this.props.style, {
            opacity: this.props.anim,
            width: actionBtnWidth,
            height: actionBtnWidth,
            transform: [{
              translateY: this.props.anim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, offsetY],
              })
            }, {
              translateX: this.props.anim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, offsetX],
              })}, {
              rotate: this.props.anim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '720deg'],
              })},
{
            scale: this.props.anim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
              })}
            ]
          }]}
      >
        <TouchableOpacity style={{flex:1}} activeOpacity={this.props.activeOpacity || 0.85} onPress={this.props.onPress}>
          <View
            style={[styles.actionButton,{
                width: actionBtnWidth,
                height: actionBtnWidth,
                borderRadius: actionBtnWidth / 2,
                backgroundColor: this.props.buttonColor || this.props.btnColor,
              }]}
          >
            {this.props.children}
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  }

}

const styles = StyleSheet.create({
  actionButton: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingTop: 2,
    shadowOpacity: 0.3,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowColor: '#444',
    shadowRadius: 1,
    backgroundColor: 'red',
    position: 'absolute',
  },
});
