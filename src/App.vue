<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <h1>{{count}}</h1>
  <h1>我是双倍{{doubleCount}}</h1>
  <button @click="addCount">点我点我</button>
</template>

<script lang="ts">
import { defineComponent, ref, computed, reactive, toRefs } from 'vue';
interface DataProps {
  count: number;
  doubleCount: number;
  addCount: () => void;
}
export default defineComponent({
  name: 'App',
  setup(props, context) {
    // const count = ref(0)
    // const addCount = () => {
    //   count.value++
    // }
    const data: DataProps = reactive({
      count: 0,
      addCount: () => {
        data.count++
      },
      doubleCount: computed(() => data.count * 2)
    })
    const refData = toRefs(data)
    return {
      ...refData
    }
  }
});
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
