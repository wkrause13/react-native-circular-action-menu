import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Animated,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
const { width } = Dimensions.get('window');

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
    return (
      <Animated.View
        style={[styles.actionButtonWrap, {
            alignItems: this.state.alignItems,
            opacity: this.props.anim,
            transform: [{
              translateY: this.props.anim.interpolate({
                inputRange: [0, 1],
                outputRange: [40, 0],
              }),
            }],
          },
          ]}
      >
        <TouchableOpacity style={{flex:1}} activeOpacity={this.props.activeOpacity || 0.85} onPress={this.props.onPress}>
          <View
            style={[styles.actionButton, this.props.style, {
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
  actionButtonWrap: {
    width,
  },
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
  },
});
