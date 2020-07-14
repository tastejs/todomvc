#include <uv.h>
#include <v8.h>
#include <napi.h>
#include <uv.h>
#include <node.h>

Napi::Value Run(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  Napi::HandleScope scope(env);
  uv_run(node::GetCurrentEventLoop(v8::Isolate::GetCurrent()), UV_RUN_ONCE);
  return env.Undefined();
}

static Napi::Object init(Napi::Env env, Napi::Object exports) {
  exports.Set(Napi::String::New(env, "run"), Napi::Function::New(env, Run));
  return exports;
}

NODE_API_MODULE(deasync, init)
