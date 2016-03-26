import React, { View, TextInput, StyleSheet } from 'react-native'

let Input = ({ _inputChange, inputValue }) => (
	<View style={ styles.inputContainer }>
		<TextInput
			value={ inputValue }
			style={ styles.input }
			placeholder='What needs to be done?'
			placeholderTextColor='CACACA'
			selectionColor='666666'
			onChangeText={ _inputChange } />
	</View>
)

let styles = StyleSheet.create({
	inputContainer: {
		marginLeft:20,
		marginRight:20,
		shadowOpacity: .2,
		shadowRadius: 3,
		shadowColor: '000000',
		shadowOffset: { width: 2, height: 2 }
	},
	input: {
		height:60,
		backgroundColor: 'ffffff',
		paddingLeft:10,
		paddingRight:10
	},
})

export default Input
