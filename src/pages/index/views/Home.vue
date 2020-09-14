<template>
  <div class="home">
    <h1>Home</h1>
  </div>
</template>
<script>
export default {
  name: "Home",
  created(){
    this.axios.get('index.json').then(res=>{
      console.log(res.data);
    })
    
  }
};
</script>
