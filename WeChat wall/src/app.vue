<template>
	<router-view></router-view>
</template>
<script>
	export default {
		data: function(){
            return {
                state: false
            };
        },
	}
</script>
<style type="text/css">
    *{
        margin: 0;
        padding: 0;
    }
    html,body{
        height:100%;
    }
	body,html,button,div,ul,li {
	  box-sizing: border-box;
	}
	body{
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		-webkit-overflow-scrolling: touch;
		-webkit-tap-highlight-color: transparent;
	}
	button {
	  border: none;
	  display: inline-block;
	}
	ul li {
	  list-style: none;
	}
</style>

