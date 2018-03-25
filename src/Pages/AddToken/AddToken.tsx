'use strict';

import React from 'react';
import {
  ScrollView,
  RefreshControl,
  View,
  DeviceEventEmitter,
} from 'react-native';
import {
  List,
  ListItem,
} from 'react-native-elements';
import { connect } from 'react-redux';
import _ from 'lodash';

import { MasterDataService, WalletService } from '../../Services';
import { Token, Wallet } from '../../Models';
import WalletActions from '../Wallet/WalletActions';
import { SearchBar } from '../_shared/inputs';
import { ETH } from '../../Constants';
import { Wrapper } from '../_shared/layout';

interface InternalProps {
  navigation: any; // Navigation Object
}

interface ReduxProps {
  updateWallet: (wallet: Wallet) => void;
}
interface InternalState {
  tokens: Token[];
  searchText: string;
}
class AddToken extends React.Component<InternalProps & ReduxProps, InternalState> {

  public refs = {
  };

  public constructor(props) {
    super(props);
    this.state = { tokens: [], searchText: '' };
  }
  public async componentWillMount() {
    const { supportedTokens } = await MasterDataService.getMasterData();
    this.setState({ tokens: supportedTokens });
  }

  public onTokenPress(tokenSelected: Token) {
    if (tokenSelected.symbol === ETH) {
      DeviceEventEmitter.emit('showToast', 'Etherium must be always selected');
      return;
    }
    const wallet = WalletService.getInstance().wallet;
    const isAdded = _.find(wallet.tokens, { symbol: tokenSelected.symbol });
    // Is added, remove it
    if (isAdded) {
      wallet.tokens = wallet.tokens.filter((token) => token.symbol !== tokenSelected.symbol);
    } else { // Is not in the wallet, add it
      wallet.tokens.push(Token.initTokenForWallet(tokenSelected, wallet.address));
    }
    this.props.updateWallet(wallet);
    this.setState({ tokens: this.state.tokens }); // refresh
  }
  private tokenFilter = (token: Token) => {
    const searchText = this.state.searchText.toLocaleLowerCase();
    return token && (
      token.symbol.toLowerCase().indexOf(searchText) !== -1
      || token.name.toLowerCase().indexOf(searchText) !== -1);
  }

  public render() {
    const wallet = WalletService.getInstance().wallet;

    return (
      <View style={{ backgroundColor: '#FFFFFF' }} >
        <Wrapper padding={16}>

          <SearchBar
            onChangeText={(searchText) => this.setState({ searchText })}
            value={this.state.searchText}
          />
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={this.state.tokens.length === 0}
              />
            }
          >
            {this.state.tokens.length === 0 && <View style={{ height: 640 }} />}
            <List containerStyle={{ borderTopWidth: 0, marginTop: 4 }} >
              {this.state.tokens.filter(this.tokenFilter).map((token, index) => {
                const isSelected = _.find(wallet.tokens, { symbol: token.symbol });
                return (
                  <ListItem
                    containerStyle={{ borderBottomColor: '#DDDDDD', borderTopColor: '#DDDDDD' }}
                    key={index}
                    title={`${token.name}: ${token.symbol}`}
                    titleStyle={{ fontSize: 14, marginLeft: 0 }}
                    titleContainerStyle={{ marginLeft: 0 }}
                    rightIcon={{
                      name: isSelected ? 'ios-star' : 'ios-star-outline',
                      type: 'ionicon',
                      color: isSelected ? '#5589FF' : '#AAAAAA',
                    }}
                    onPress={() => this.onTokenPress(token)}
                  />);
              })}

            </List>
          </ScrollView >
        </Wrapper >
      </View >
    );
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    updateWallet: (wallet: Wallet) => dispatch(WalletActions.updateWalletRedux(wallet)),
  };
};

const mergeProps = (reduxProps, dispatchProps, ownProps) => {
  return { ...reduxProps, ...dispatchProps, ...ownProps };
};

export default connect(null, mapDispatchToProps, mergeProps)(AddToken);
