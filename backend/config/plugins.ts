export default ({ env }) => ({
  upload: {
    config: {
      provider: 'local',
      providerOptions: {
        sizeLimit: 250 * 1024 * 1024, // 250 MB – so MP3 and other audio files save
      },
    },
  },
});
