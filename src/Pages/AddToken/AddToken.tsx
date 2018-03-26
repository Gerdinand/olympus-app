'use strict';

import React from 'react';
import {
  ScrollView,
  RefreshControl,
  View,
  DeviceEventEmitter,
  Dimensions,
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
import Colors from '../../Constants/Colors';

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

  public constructor(props) {
    super(props);
    this.state = { tokens: [], searchText: '' };
  }
  public async componentWillMount() {
    const { supportedTokens } = MasterDataService.get().getMasterData();
    this.setState({ tokens: supportedTokens });
  }

  public onTokenPress(tokenSelected: Token) {
    if (tokenSelected.symbol === ETH) {
      DeviceEventEmitter.emit('showToast', 'Ethereum must be always selected');
      return;
    }
    const wallet = WalletService.getInstance().wallet;
    const isAdded = _.find(wallet.tokens, { symbol: tokenSelected.symbol });
    // Is added, remove it
    if (isAdded) {
      wallet.tokens = wallet.tokens.filter((token) => token.symbol !== tokenSelected.symbol);
    } else { // Is not in the wallet, add it
      wallet.tokens.push(Token.initTokenForWallet(tokenSelected, wallet.address));
      wallet.forceReoload = true;
    }
    this.props.updateWallet(wallet);
    this.setState({ tokens: this.state.tokens }); // refresh
  }
  private tokenFilter = (token: Token) => {
    const searchText = this.state.searchText.toLowerCase();
    return token && (
      token.symbol.toLowerCase().indexOf(searchText) !== -1
      || token.name.toLowerCase().indexOf(searchText) !== -1);
  }

  public render() {
    const wallet = WalletService.getInstance().wallet;
    const walletTokensSymbols = wallet.tokens.map((token) => token.symbol);
    const tokens = this.state.searchText.length > 1 ? this.state.tokens.filter(this.tokenFilter) : wallet.tokens;
    return (
      <View style={{ backgroundColor: Colors.backgroundColor }} >
        <Wrapper padding={16}>

          <SearchBar
            onChangeText={(searchText) => this.setState({ searchText })}
            value={this.state.searchText}
            placeholder="Type 2 characters to search"
          />
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={this.state.tokens.length === 0}
              />
            }
            // HEIGHT - Header - SearchBar - TopPadding - BottomPadding
            style={{ height: Dimensions.get('window').height - 45 - 40 - 16 - 16 }}
          >
            {this.state.tokens.length === 0 && <View style={{ height: 640 }} />}
            <List containerStyle={{ borderTopWidth: 0, marginTop: 4 }} >
              {tokens.map((token, index) => {
                // Dont show all FIX tokens (now ETH only)
                if (token.symbol === ETH) {
                  return null;
                }
                const isSelected = walletTokensSymbols.indexOf(token.symbol) !== -1;
                return (
                  <ListItem
                    containerStyle={{ borderBottomColor: Colors.inputUnderline, borderTopColor: Colors.inputUnderline }}
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
