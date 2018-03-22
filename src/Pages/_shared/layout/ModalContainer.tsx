import React, { Component } from 'react';
import { Modal, View, Dimensions } from 'react-native';
import style from './ModalContainerStyle';

interface ModalContainerProps {
  width?: number;
  height?: number;
  visible: boolean;
  style?: any;
}
const MODAL_MARGIN = 24;

const DEFAULT_WIDTH = Dimensions.get('window').width - MODAL_MARGIN;
const DEFAULT_HEIGHT = 300;

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
