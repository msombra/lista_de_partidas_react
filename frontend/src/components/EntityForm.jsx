import { Button, Flex, Grid, Space, Typography } from 'antd'

const { Title } = Typography
const { useBreakpoint } = Grid

export const EntityForm = ({
    title,
    isEditing,
    submitDisabled,
    onSubmit,
    onCancel,
    submitLoading = false,
    children,
}) => {
    const screens = useBreakpoint()

    return (
        <section>
            <Title level={5}>{title}</Title>

            <form onSubmit={onSubmit}>
                <Flex gap="small" vertical={!screens.sm}>
                    {children}

                    <Space>
                        <Button
                            type="primary"
                            htmlType="submit"
                            disabled={submitDisabled}
                            loading={submitLoading}
                        >
                            {isEditing ? 'Atualizar' : 'Salvar'}
                        </Button>

                        {isEditing && (
                            <Button
                                type="primary"
                                danger
                                htmlType="button"
                                onClick={onCancel}
                            >
                                Cancelar
                            </Button>
                        )}
                    </Space>
                </Flex>
            </form>
        </section>
    )
}
