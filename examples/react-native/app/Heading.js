import React, { View, Text, StyleSheet } from 'react-native'

let Heading = () => (
	<View style={ styles.header }>
		<Text style={ styles.headerText }>todos</Text>
	</View>
)

let styles = StyleSheet.create({
	header: {
		marginTop:80
	},
	headerText: {
		textAlign: 'center',
		fontSize:72,
		color: 'rgba(175, 47, 47, 0.25)',
		fontWeight: '100'
	}
})

export default Heading
