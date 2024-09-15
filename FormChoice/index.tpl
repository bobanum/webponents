<template>
	<div class="window open">
		<header id="test">
			<span id="title">Untitled</span>
			<div class="icons"><svg viewBox="0 0 512 512" class="icon minimize">
					<path d="m64 384h384v64h-384z"></path>
				</svg><svg viewBox="0 0 512 512" class="icon restore">
					<path d="m128 64v64h256v256h64v-320zm-64 128v256h256v-256zm64 64h128v128h-128z"></path>
				</svg><svg viewBox="0 0 512 512" class="icon maximize">
					<path d="m64 64v384h384v-384zm64 64h256v256h-256z"></path>
				</svg><svg viewBox="0 0 512 512" class="icon close">
					<path d="m64 64v64l128 128-128 128v64h64l128-128 128 128h64v-64l-128-128 128-128v-64h-64l-128 128-128-128h-64z"></path>
				</svg></div>
		</header>
		<div class="main">
			<slot></slot>
		</div>
		<footer><button id="btn_ok">OK</button><button id="btn_cancel">Cancel</button></footer>
	</div>
	<div class="controls">
		<div class="control nw-resize"></div>
		<div class="control n-resize"></div>
		<div class="control ne-resize"></div>
		<div class="control w-resize"></div>
		<div class="control e-resize"></div>
		<div class="control sw-resize"></div>
		<div class="control s-resize"></div>
		<div class="control se-resize"></div>
	</div>
</template>