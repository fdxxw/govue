<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <HelloWorld msg="Hello Vue 3 + TypeScript + Vite" />
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import HelloWorld from './components/HelloWorld.vue'
import appService from "/@/api/app";
import {useState} from "/@/store"
export default defineComponent({
  name: 'App',
  components: {
    HelloWorld
  },
  setup() {
    const state: any = useState()
    onMounted(async () => {
      state.app = await appService.Info();
    })
    return {
      state
    }
  }
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
