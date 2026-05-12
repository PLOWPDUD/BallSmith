import https from 'https';

https.get('https://commons.wikimedia.org/w/thumb.php?f=Flag_of_the_Soviet_Union.svg&w=1280', (res) => {
  console.log('Headers:', res.headers);
});
