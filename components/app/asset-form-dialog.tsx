"use client";

import { useState } from "react";
import { Modal, Form, Input, Select, App } from "antd";
import { FileAddOutlined } from "@ant-design/icons";

const { TextArea } = Input;

/* 预置标签选项 */
const TAG_OPTIONS = [
  { value: "可观测性", label: "可观测性" },
  { value: "权限控制", label: "权限控制" },
  { value: "Trace", label: "Trace" },
  { value: "智能体", label: "智能体" },
  { value: "检索", label: "检索" },
  { value: "安全", label: "安全" },
];

interface AssetFormDialogProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export function AssetFormDialog({ open, onClose, onCreated }: AssetFormDialogProps) {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const { message } = App.useApp();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);

      const res = await fetch("/api/assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: values.title.trim(),
          content: values.content.trim(),
          tags: values.tags ?? [],
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        message.error(err.error ?? "创建失败");
        return;
      }

      message.success("资产已添加");
      form.resetFields();
      onCreated();
    } catch {
      // 表单校验失败，antd 自动处理
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <FileAddOutlined style={{ color: "#165DFF" }} />
          <span>新增知识资产</span>
        </div>
      }
      open={open}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={submitting}
      okText="确认添加"
      cancelText="取消"
      okButtonProps={{
        style: { borderRadius: 12 },
      }}
      cancelButtonProps={{
        style: { borderRadius: 12 },
      }}
      styles={{
        body: { padding: "24px 24px 8px" },
      }}
      transitionName=""
      maskStyle={{ backdropFilter: "blur(4px)" }}
      style={{ top: 60 }}
    >
      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        initialValues={{ tags: [] }}
      >
        <Form.Item
          name="title"
          label="标题"
          rules={[{ required: true, message: "请输入资产标题" }]}
        >
          <Input
            placeholder="请输入知识资产标题"
            maxLength={100}
            showCount
            style={{ borderRadius: 12 }}
          />
        </Form.Item>

        <Form.Item
          name="content"
          label="内容"
          rules={[{ required: true, message: "请输入资产内容" }]}
        >
          <TextArea
            placeholder="请输入知识资产内容描述"
            rows={5}
            maxLength={2000}
            showCount
            style={{ borderRadius: 12 }}
          />
        </Form.Item>

        <Form.Item name="tags" label="标签">
          <Select
            mode="multiple"
            placeholder="选择或输入标签"
            options={TAG_OPTIONS}
            style={{ borderRadius: 12 }}
            tokenSeparators={[","]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
