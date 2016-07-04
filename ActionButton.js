import React, {
  Component,
  PropTypes,
} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import ActionButtonItem from './ActionButtonItem';

export default class ActionButton extends Component {

  constructor(props) {
    super(props);
    this.state = {
      active: props.active,
      anim: new Animated.Value(props.active ? 1 : 0),
    };

    this.timeout = null;
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  getActionButtonStyles() {
    return [styles.actionBarItem, this.getButtonSize(), styles.actionsCenter];
  }

  getActionsStyle() {
    return [styles.actionsCenter, this.getButtonSize()];
  }

  getButtonSize() {
    return {
      width: this.props.size,
      height: this.props.size,
    };
  }


  animateButton() {
    if (this.state.active) this.reset();

    Animated.spring(this.state.anim, {
      toValue: 1,
      duration: 750,
    }).start();

    this.setState({ active: true });
  }

  reset() {
    Animated.spring(this.state.anim, {
      toValue: 0,
      duration: 750,
    }).start();

    setTimeout(() => {
      this.setState({ active: false });
    }, 250);
  }

  renderButton() {
    return (
      <View
        style={this.getActionButtonStyles()}
      >
        <TouchableOpacity
          activeOpacity={0.85}
          onLongPress={this.props.onLongPress}
          onPress={() => {
              this.props.onPress()
              if (this.props.children) {
                this.animateButton();
              }
            }}
        >
          <Animated.View
            style={
              [
                styles.btn,
                {
                  width: this.props.size,
                  height: this.props.size,
                  borderRadius: this.props.size / 2,
                  backgroundColor: this.state.anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [this.props.buttonColor, this.props.btnOutRange]
                  }),
                  transform: [
                    {
                      scale: this.state.anim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, this.props.outRangeScale]
                      }),
                    },
                    {
                      rotate: this.state.anim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', this.props.degrees + 'deg']
                      }),
                    }],
                }]}>
            {this.renderButtonIcon()}
          </Animated.View>
        </TouchableOpacity>
      </View>
    );
  }

  renderButtonIcon() {
    if (this.props.icon) {
      return this.props.icon;
    }

    return (
      <Animated.Text
        style={[styles.btnText,
                {
                  color: this.state.anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [this.props.buttonTextColor, this.props.btnOutRangeTxt]
                  })
                }]}>
        +
      </Animated.Text>
    );
  }

  renderActions() {
    if (!this.state.active) return null;

    const startRadian = this.props.startDegree * Math.PI / 180;
    const endRadian = this.props.endDegree * Math.PI / 180;
    const offset = (endRadian - startRadian) / 5;

    return (
      React.Children.map(this.props.children, (button, index) => {
        return (
          <ActionButtonItem
            key={index}
            position={this.props.position}
            anim={this.state.anim}
            size={this.props.size}
            style={this.getActionsStyle()}
            radius={this.props.radius}
            angle={startRadian - index * offset}
            btnColor={this.props.btnOutRange}
            {...button.props}
            onPress={() => {
                if (this.props.autoInactive) {
                  this.timeout = setTimeout(() => {
                    this.reset();
                  }, 200);
                }
                button.props.onPress();
              }}
          />
        );
      })
    );
  }


  render() {
    let backdrop;
    if (this.state.active) {
      backdrop = (
        <TouchableWithoutFeedback
          style={styles.overlay}
          onPress={() => this.reset()}
        >
          <Animated.View
            style={
              {
                backgroundColor: this.props.bgColor,
                opacity: this.state.anim,
                flex: 1,
              }
                  }
          >
            {this.props.backdrop}
          </Animated.View>
        </TouchableWithoutFeedback>
      );
    }
    return (
      <View
        pointerEvents="box-none"
        style={styles.overlay}
      >
        {backdrop}
        <View
          pointerEvents="box-none"
          style={styles.overlay}
        >
          {this.props.children && this.renderActions()}
          {this.renderButton()}
        </View>
      </View>
    );
  }
}

ActionButton.Item = ActionButtonItem;

ActionButton.propTypes = {
  active: PropTypes.bool,
  position: PropTypes.string,
  bgColor: PropTypes.string,
  buttonColor: PropTypes.string,
  buttonTextColor: PropTypes.string,
  size: PropTypes.number,
  autoInactive: PropTypes.bool,
  onPress: PropTypes.func,
  backdrop: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
  ]),
  startDegree: PropTypes.number,
  endDegree: PropTypes.number,
  radius: PropTypes.number,
  children: PropTypes.node,
};

ActionButton.defaultProps = {
  active: false,
  bgColor: 'transparent',
  buttonColor: 'rgba(0,0,0,1)',
  buttonTextColor: 'rgba(255,255,255,1)',
  outRangeScale: 1,
  autoInactive: true,
  onPress: () => {},
  backdrop: false,
  degrees: 135,
  size: 42,
  startDegree: 180,
  endDegree: 0,
  radius: 100,
  btnOutRange: 'rgba(0,0,0,1)',
  btnOutRangeTxt: 'rgba(255,255,255,1)',
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: 'transparent',
  },
  actionBarItem: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  btn: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowOpacity: 0.3,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowColor: '#444',
    shadowRadius: 1,
  },
  btnText: {
    marginTop: -4,
    fontSize: 24,
    backgroundColor: 'transparent',
    position: 'relative',
  },
  actionsCenter: {
    position: 'absolute',
    left: 150,
    bottom: 20,
  },
});
