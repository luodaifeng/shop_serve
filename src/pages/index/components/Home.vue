<template>
    <div>
        <el-button @click="clearToken">退出</el-button>
    </div>
</template>
<script>
export default {
    data() {
        return {
            
        }
    },
    methods: {
        clearToken(){ //退出按钮，清除token，回退到登录页面
            window.sessionStorage.clear()
            this.$router.push('/login')
        }
    },
}
</script>
<style lang="less" scope>
    
</style>