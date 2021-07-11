import { IBadgeProps } from '../../model';
import * as React from 'react';
import styled from 'styled-components';

export const BadgeComponent = ({ name }: IBadgeProps) => {
	return <Container>{name}</Container>;
};

const Container = styled.div`
	font-size: 1rem;
	text-align: center;
	border: ${props => `${props.theme.borderWidth}px solid ${props.theme.primary}`};
	border-radius: ${props => props.theme.borderRadius}px;
	color: ${props => props.theme.primary};
	padding: 0.25rem 0.5rem;
	font-weight: 400;
`;
