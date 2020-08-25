import store from "../store";

export default {
    methods: {
      authAfterRouter(){
          window.log('authAfterRouter')
          if (!store.state.user.authenticated) {
              return this.$router.push('/');
          }
          if (this.$route.query.return) {
            this.$router.push(this.$route.query.return);
          }
          else if (!this.$store.state.user.state_loaded) {

              this.$store.watch(
                  (state) => state.user.state_loaded,
                  () => {
                      if (this.$store.state.user.totals.total) {
                          // Has operations

                          return this.$router.push('/');
                      } else return this.$router.push('/funds');
                  }
              )

          } else if (this.$store.state.user.totals.total) {

              // Has operations
              return this.$router.push('/');
          } else return this.$router.push('/funds');

      }
    },
}