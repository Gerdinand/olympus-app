import React from 'react';

import { SearchBar as NativeSearchBar, SearchBarProps } from 'react-native-elements';
import { View, Image, StyleSheet } from 'react-native';
import Colors from '../../../Constants/Colors';

// SearchBar from elements but customized to our design
export class SearchBar extends React.Component<SearchBarProps> {
  public constructor(props: SearchBarProps) {
    super(props);
  }

  public render() {
    return (
      <View>
        <NativeSearchBar
          {...this.props}
          lightTheme
          containerStyle={styles.searchContainer}
          inputStyle={styles.searchInput}
          noIcon
        />
        <Image style={styles.searchIcon} source={require('../../../../images/search.png')} />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  searchContainer: { backgroundColor: 'white', borderWidth: 0, borderTopWidth: 0, borderBottomWidth: 0 },
  searchIcon: { bottom: 10, position: 'absolute', width: 20, height: 20, left: 16 },
  searchInput:
    {
      backgroundColor: 'transparent', borderRadius: 4, borderWidth: 0.5, borderColor: Colors.borderColor,
      height: 40,
      margin: 0,
      paddingLeft: 20 + 16 + 4, // As per searchIcon size + searchIcon left + margin
    },
});
