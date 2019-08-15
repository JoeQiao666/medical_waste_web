<template>
    <div >
      <canvas  id="canvas"></canvas>
    </div>
</template>
<style></style>
<script>
    import QRCode from 'qrcode'
    export default{
      data(){
        return {
        }
      },
      props:['name'],
      components: {
        QRCode: QRCode
      },
      watch:{
          name:{
                  handler: function (val) {
                     this.useqrcode()
                  },
                  deep: true
          }
      },
      methods: {
        useqrcode(){
          var canvas = document.getElementById('canvas');
          QRCode.toCanvas(canvas, JSON.stringify(this.name),{width:120,height:120,margin:0}, function (error) {
            if (error) console.error(error)
          })
        }
      },
      mounted(){
            this.useqrcode();
      }
    }
</script>