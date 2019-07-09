<template>
    <div id="qrCode">
      <canvas id="canvas"></canvas>
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