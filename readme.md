# Antibody

A clusterfuck of attempted solutions to article bodies. A fun clusterfuck. No, not that kind.

## Development

Get started the usual way:

```bash
git clone <this>
npm install
```

Then dig into Sir Trevor and run their crazy build manually. I'll have to automate that if I want to run this on Heroku. Or maybe they should add a `postinstall` script, hmmm?

```bash
pushd node_modules/sir-trevor
npm install
npm run dist
popd
```

Now carry on with a more sane workflow:

```bash
npm run dev # Starts a live reloading build and server
```

If you want to see a production build:

```bash
npm run dist
```

The build is separated into `webpack.config.development.js`, which is optimized for development comfort and speed, and `webpack.config.production.js` which tortures the codebase into a bunch of little compressed pieces.

## Notes

- Hashed build filenames are incompatible with a hot-reloading server, because new apps are being created on each rebuild, instead of one app changing (which triggers a reload from a file watching server)
- Webpack split builds and the stock filename hashing mechanism are incompatible (https://github.com/webpack/webpack/issues/1315) because whenever any code changes in the app, all chunks change, aquiring new hashes and busting out any caches. [webpack-md5-hash](https://github.com/erm0l0v/webpack-md5-hash) does not suffer from this problem.
- Cleaning up old hashed scripts: we want to do this just before creating new ones. The [webpack-clean](https://github.com/allexcd/webpack-clean) plugin isn't a great fit for that, because it was designed to run after the build, not before, so I forked it to add a boolean `before` parameter. This currently suffers from a filesystem [race condition](https://github.com/allexcd/webpack-clean/pull/2). The solution is probably to convert some async operation to sync, but cleanup isn't a high priority for me right now. It might be better to keep a semi-permanent record of hashed filenames and delete them each individually after creating new ones, instead of `rm`ing a glob.
- Hot module reloading appears to be a little quirky. I don't think it can reload the root application module. A classic live reloading server will have to suffice for now.

## References

- [Webpack Optimization](https://github.com/webpack/docs/wiki/optimization);
