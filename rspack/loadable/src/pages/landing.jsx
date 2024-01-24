import S from "./landing.scss";
import { changeme } from "../changeme";
import loadable from "@loadable/component";

console.log(S);

const LodashLib = loadable.lib(
  () => import(/* webpackPrefetch: true */ "lodash"),
);

const ContentComponent = loadable(() =>
  import(/* webpackPrefetch: true */ "../components/content").then(
    (r) => r.Content,
  ),
);

export function Landing() {
  return (
    <div className={S.foo}>
      <section style={{ color: S.darkColor }}>
        React Refresh: {changeme}
      </section>
      <section>
        <LodashLib fallback={`loading: ${changeme}`}>
          {({ default: _ }) =>
            _.template("loaded: <%= foo %>")({ foo: changeme })
          }
        </LodashLib>
      </section>

      <section>
        <ContentComponent fallback={<div>loading content component</div>} />
      </section>
    </div>
  );
}
