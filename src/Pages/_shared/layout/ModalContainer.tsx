import React, { Component } from 'react';
import { Modal, View, Dimensions } from 'react-native';
import style from './ModalContainerStyle';

interface ModalContainerProps {
  width?: number;
  height?: number;
  visible: boolean;
  style?: any;
}

const DEFAULT_WIDTH = Dimensions.get('window').width;
const DEFAULT_HEIGHT = 250;

export default class ModalContainer extends Component<ModalContainerProps> {

  constructor(props) {
    super(props);
  }

  public render() {
    return (
      <Modal
        visible={this.props.visible}
        transparent
      >
        <View
          style={style.background}
        >
          <View
            style={[
              style.modal,
              {
                width: this.props.width ? this.props.width : DEFAULT_WIDTH,
                height: this.props.height ? this.props.height : DEFAULT_HEIGHT,
              },
              this.props.style ? this.props.style : {},
            ]}
          >
            {this.props.children}
          </View>
        </View>
      </Modal>
    );
  }
}
