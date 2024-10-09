import { LinkTo } from '@ember/routing';

<template>
	<ul class="filters">
		<li>
			<LinkTo @route="index" @activeClass="selected">
				All
			</LinkTo>
		</li>
		<li>
			<LinkTo @route="active" @activeClass="selected">
				Active
			</LinkTo>
		</li>
		<li>
			<LinkTo @route="completed" @activeClass="selected">
				Completed
			</LinkTo>
		</li>
	</ul>
</template>
