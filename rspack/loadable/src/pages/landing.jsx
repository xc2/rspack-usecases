import "../style.less";
import { changeme } from "../changeme";
import loadable, { lazy } from "@loadable/component";
import { Suspense, useState } from "react";

const LodashLib = loadable.lib(
  () => import(/* webpackPrefetch: true */ "lodash"),
);

const ContentComponent = loadable(() =>
  import(/* webpackPrefetch: true */ "../components/content").then(
    (r) => r.Content,
  ),
);

export function Landing() {
  const [show, setShow] = useState(false);
  return (
    <div>
      <section>React Refresh: {changeme}</section>
      <section>
        <LodashLib fallback={`loading: ${changeme}`}>
          {({ default: _ }) =>
            _.template("loaded: <%= foo %>")({ foo: changeme })
          }
        </LodashLib>
      </section>

      <section>
        <button type="button" onClick={() => setShow((old) => !old)}>
          show content component
        </button>
        {!show || (
          <ContentComponent fallback={<div>loading content component</div>} />
        )}
      </section>
    </div>
  );
}
